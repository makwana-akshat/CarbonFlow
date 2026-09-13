import json
import logging
import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

from app.ai.provider import LLMProvider
from app.ai.memory import ChatSessionManager
from app.ai.tools import ToolRegistry
from app.ai.prompts import CARBONFLOW_CHATBOT_SYSTEM_PROMPT_V1
from app.ai.context_resolver import ContextResolver
from app.repositories.marketplace_repository import MarketplaceRepository

logger = logging.getLogger(__name__)

class DashboardAction(BaseModel):
    type: str
    payload: dict

class ChatIntentResponse(BaseModel):
    message: str
    language: str = "en"
    intent: str = "UNKNOWN"
    dashboard_action: DashboardAction | None = None
    requires_confirmation: bool = False

class AgentOrchestrator:
    def __init__(self, clerk_user_id: str, session_id: str):
        self.clerk_user_id = clerk_user_id
        self.session_id = session_id
        self.memory = ChatSessionManager()
        self.tool_registry = ToolRegistry(clerk_user_id)
        self.provider = LLMProvider()
        self.market_repo = MarketplaceRepository()

    def process_message(self, message: str) -> ChatIntentResponse:
        session = self.memory.get_session(self.session_id)
        session["user_id"] = self.clerk_user_id

        # -------------------------------------------------------------
        # 1. PENDING ACTION RESOLUTION (Confirmation / Cancellation)
        # -------------------------------------------------------------
        pending_action = session.get("pending_action")
        requires_confirmation = session.get("requires_confirmation", False)

        if pending_action == "CREATE_ORDER" and requires_confirmation:
            if ContextResolver.is_positive_confirmation(message):
                params = session.get("pending_action_parameters") or {}
                listing_id = params.get("listing_id")
                volume = float(params.get("volume", 0))
                transport_mode = params.get("transport_mode", "Road")
                supplier_name = params.get("supplier_name", "Supplier")

                logger.info(f"[ORDER] User confirmed order placement. Calling existing OrderService for listing={listing_id}, volume={volume}")
                res_str = self.tool_registry.create_order(
                    listing_id=listing_id,
                    volume_tonnes=volume,
                    transport_mode=transport_mode
                )
                try:
                    res = json.loads(res_str)
                except Exception:
                    res = {"success": False, "error": "Could not parse order service result"}

                if res.get("success"):
                    order_id = res.get("order_id")
                    short_id = res.get("short_id", f"ORD-{order_id[:4].upper() if order_id else 'NEW'}")
                    total_val = res.get("total_value", params.get("total_value", 0))
                    status = res.get("status", "pending")

                    # Update structured state
                    session["last_order_id"] = order_id
                    session["last_action"] = "ORDER_CREATED"
                    session["last_tool"] = "create_order"
                    session["pending_action"] = None
                    session["pending_action_parameters"] = None
                    session["requires_confirmation"] = False
                    self.memory.save_session(self.session_id, session)

                    reply_text = (
                        f"Order placed successfully!\n\n"
                        f"- **Order ID**: {short_id}\n"
                        f"- **Supplier**: {supplier_name}\n"
                        f"- **Quantity**: {volume:,.0f} tonnes\n"
                        f"- **Total Value**: ₹{total_val:,.2f}\n"
                        f"- **Status**: {status.capitalize()}\n\n"
                        f"You can track this order directly from your Orders dashboard or ask me 'Track it'."
                    )

                    return ChatIntentResponse(
                        message=reply_text,
                        intent="CREATE_ORDER",
                        dashboard_action=DashboardAction(type="SHOW_ORDER", payload={"order_id": order_id}),
                        requires_confirmation=False
                    )
                else:
                    session["pending_action"] = None
                    session["pending_action_parameters"] = None
                    session["requires_confirmation"] = False
                    self.memory.save_session(self.session_id, session)

                    safe_err = res.get("detail") or res.get("error") or "Order could not be completed."
                    return ChatIntentResponse(
                        message=f"I couldn't place the order because the marketplace could not complete the request: {safe_err}",
                        intent="CREATE_ORDER",
                        requires_confirmation=False
                    )

            elif ContextResolver.is_negative_confirmation(message):
                session["pending_action"] = None
                session["pending_action_parameters"] = None
                session["requires_confirmation"] = False
                session["last_action"] = "ORDER_CANCELLED"
                self.memory.save_session(self.session_id, session)

                return ChatIntentResponse(
                    message="Understood, I have cancelled the order placement. No order was created. Let me know if you would like to search for other suppliers or do something else.",
                    intent="CANCEL_ORDER",
                    requires_confirmation=False
                )

        # -------------------------------------------------------------
        # 2. CONTEXT-AWARE INTENT CLASSIFICATION
        # -------------------------------------------------------------
        detected_intent = ContextResolver.detect_intent(message, session)
        logger.info(f"[INTENT] message='{message}' detected_intent='{detected_intent}'")

        # -------------------------------------------------------------
        # 2A. SUPPLIER SELECTION FLOW ("the first one", "second one looks good")
        # -------------------------------------------------------------
        if detected_intent == "SELECT_SUPPLIER":
            resolved_id = ContextResolver.resolve_supplier_reference(message, session)
            if resolved_id:
                listing = self.market_repo.get_listing_by_id(resolved_id)
                if listing:
                    users_data = listing.get("users", {}) or {}
                    supplier_name = f"{users_data.get('first_name', '')} {users_data.get('last_name', '')}".strip() or users_data.get('company_name') or "Selected Supplier"
                    price = float(listing.get("price_per_ton") or 0)
                    available_qty = float(listing.get("volume_tpa") or 0)
                    qty = session.get("selected_quantity_tonnes") or min(available_qty, 500)

                    session["selected_supplier_id"] = resolved_id
                    session["selected_supplier_name"] = supplier_name
                    session["selected_price_per_tonne"] = price
                    session["last_action"] = "SUPPLIER_SELECTED"
                    self.memory.save_session(self.session_id, session)

                    reply_text = (
                        f"**{supplier_name}** ({listing.get('facility_name', '')}, {listing.get('location', '')}) is selected.\n\n"
                        f"- **Price**: ₹{price:,.2f}/t\n"
                        f"- **Available**: {available_qty:,.0f} tonnes\n\n"
                        f"Would you like me to:\n"
                        f"1. **Place the order** for this supplier?\n"
                        f"2. **Get logistics route details**?\n"
                        f"3. **Set up a price alert**?"
                    )
                    return ChatIntentResponse(
                        message=reply_text,
                        intent="FIND_SUPPLIER",
                        requires_confirmation=False
                    )

        # -------------------------------------------------------------
        # 2B. ORDER PLACEMENT FLOW ("place the order", "order from first supplier")
        # -------------------------------------------------------------
        if detected_intent == "CREATE_ORDER":
            # Resolve supplier
            resolved_id = ContextResolver.resolve_supplier_reference(message, session)
            if not resolved_id:
                resolved_id = session.get("selected_supplier_id")

            last_supplier_ids = session.get("last_supplier_ids") or []

            # If still no supplier resolved, check search results
            if not resolved_id:
                if len(last_supplier_ids) == 1:
                    resolved_id = last_supplier_ids[0]
                elif len(last_supplier_ids) > 1:
                    results = session.get("last_search_results") or []
                    options = []
                    for i, r in enumerate(results[:3], 1):
                        name = r.get("supplier_name") or r.get("company_name") or f"Supplier {i}"
                        options.append(f"{i}. **{name}** (₹{r.get('price_per_tonne', 0):,.0f}/t)")
                    options_str = "\n".join(options)

                    return ChatIntentResponse(
                        message=f"Which supplier would you like to order from?\n\n{options_str}\n\nYou can say 'first one', 'second one', or specify the supplier name.",
                        intent="CREATE_ORDER",
                        requires_confirmation=False
                    )
                else:
                    return ChatIntentResponse(
                        message="I don't have an active supplier selection in our current conversation. Please search for suppliers first or tell me which supplier you'd like to order from.",
                        intent="CREATE_ORDER",
                        requires_confirmation=False
                    )

            # Retrieve active listing from DB (source of truth)
            listing = self.market_repo.get_listing_by_id(resolved_id)
            if not listing or listing.get("status") != "active":
                return ChatIntentResponse(
                    message="The selected supplier listing is no longer active or available in the marketplace.",
                    intent="CREATE_ORDER",
                    requires_confirmation=False
                )

            # Extract requested quantity
            qty_match = re.search(r"(\d+(?:\.\d+)?)\s*(?:tonne|ton|t)\b", message, re.IGNORECASE)
            if qty_match:
                volume = float(qty_match.group(1))
            elif session.get("selected_quantity_tonnes"):
                volume = float(session.get("selected_quantity_tonnes"))
            else:
                volume = min(float(listing.get("volume_tpa", 100)), 500.0)

            available = float(listing.get("volume_tpa") or 0)
            if volume > available:
                return ChatIntentResponse(
                    message=f"Only {available:,.0f} tonnes are currently available from this supplier. Would you like to order {available:,.0f} tonnes instead?",
                    intent="CREATE_ORDER",
                    requires_confirmation=False
                )

            price_per_ton = float(listing.get("price_per_ton") or 0)
            total_value = volume * price_per_ton
            users_data = listing.get("users", {}) or {}
            supplier_name = f"{users_data.get('first_name', '')} {users_data.get('last_name', '')}".strip() or users_data.get('company_name') or "Selected Supplier"
            transport_modes = listing.get("transport_modes") or ["Road"]
            transport_mode = transport_modes[0] if transport_modes else "Road"

            # Set structured pending action in session
            session["selected_supplier_id"] = resolved_id
            session["selected_supplier_name"] = supplier_name
            session["selected_quantity_tonnes"] = volume
            session["selected_price_per_tonne"] = price_per_ton
            session["pending_action"] = "CREATE_ORDER"
            session["pending_action_parameters"] = {
                "listing_id": resolved_id,
                "supplier_name": supplier_name,
                "facility_name": listing.get("facility_name", ""),
                "volume": volume,
                "price_per_ton": price_per_ton,
                "total_value": total_value,
                "transport_mode": transport_mode,
                "delivery_location": listing.get("location", "")
            }
            session["requires_confirmation"] = True
            session["last_action"] = "ORDER_CONFIRMATION_REQUESTED"
            self.memory.save_session(self.session_id, session)

            confirm_prompt = (
                f"I can place this order for you:\n\n"
                f"- **Supplier**: {supplier_name}\n"
                f"- **Facility / Location**: {listing.get('facility_name', '')} ({listing.get('location', '')})\n"
                f"- **Quantity**: {volume:,.0f} tonnes\n"
                f"- **Price**: ₹{price_per_ton:,.2f}/t\n"
                f"- **Estimated Total Value**: ₹{total_value:,.2f}\n"
                f"- **Transport**: {transport_mode}\n\n"
                f"Would you like me to place the order?"
            )
            return ChatIntentResponse(
                message=confirm_prompt,
                intent="CREATE_ORDER",
                requires_confirmation=True
            )

        # -------------------------------------------------------------
        # 2C. CONTEXTUAL ORDER TRACKING FLOW ("track it", "where is it")
        # -------------------------------------------------------------
        if detected_intent == "TRACK_ORDER":
            target_order_id = ContextResolver.resolve_order_reference(message, session)
            # If no order id found, check if last_order_id exists in session
            if not target_order_id and session.get("last_order_id"):
                target_order_id = session.get("last_order_id")

            # Fallback: if user asked "track my order" with no explicit ID, try tracking latest
            if not target_order_id:
                target_order_id = "latest"

            track_res_str = self.tool_registry.track_order(order_id=target_order_id)
            try:
                track_res = json.loads(track_res_str)
            except Exception:
                track_res = {"success": False}

            if track_res.get("success"):
                oid = track_res.get("order_id", target_order_id)
                short_id = track_res.get("id", f"ORD-{oid[:4].upper() if oid else 'N/A'}")
                status = track_res.get("status", "unknown")
                vol = track_res.get("volume", "N/A")
                tmode = track_res.get("transport_mode", "Road")
                eta = track_res.get("eta", "Active Telemetry")

                session["last_order_id"] = oid
                session["last_action"] = "ORDER_TRACKED"
                session["last_tool"] = "track_order"
                self.memory.save_session(self.session_id, session)

                reply_text = (
                    f"Here is the tracking status for Order **{short_id}**:\n\n"
                    f"- **Status**: {status.capitalize()}\n"
                    f"- **Volume**: {vol} tonnes\n"
                    f"- **Transport**: {tmode}\n"
                    f"- **ETA / Telemetry**: {eta}\n\n"
                    f"Real-time telemetry is active on your logistics map."
                )
                return ChatIntentResponse(
                    message=reply_text,
                    intent="TRACK_ORDER",
                    dashboard_action=DashboardAction(type="SHOW_ORDER", payload={"order_id": oid}),
                    requires_confirmation=False
                )
            else:
                return ChatIntentResponse(
                    message="I couldn't find any recent orders associated with your account. Could you please provide your Order ID (e.g. ORD-1024)?",
                    intent="TRACK_ORDER",
                    requires_confirmation=False
                )

        # -------------------------------------------------------------
        # 3. LLM CONVERSATIONAL ORCHESTRATION (Search, Routes, Alerts)
        # -------------------------------------------------------------
        # Inject structured session context into system prompt
        structured_context = {
            "selected_supplier_id": session.get("selected_supplier_id"),
            "selected_supplier_name": session.get("selected_supplier_name"),
            "selected_quantity_tonnes": session.get("selected_quantity_tonnes"),
            "selected_price_per_tonne": session.get("selected_price_per_tonne"),
            "last_supplier_ids": session.get("last_supplier_ids", []),
            "last_order_id": session.get("last_order_id"),
            "pending_action": session.get("pending_action"),
            "last_action": session.get("last_action")
        }
        context_block = f"\n\nCURRENT SESSION CONTEXT:\n{json.dumps(structured_context, indent=2)}"

        messages = session.get("messages", [])
        if not messages:
            messages = [{"role": "system", "content": CARBONFLOW_CHATBOT_SYSTEM_PROMPT_V1 + context_block}]
        else:
            messages[0] = {"role": "system", "content": CARBONFLOW_CHATBOT_SYSTEM_PROMPT_V1 + context_block}

        messages.append({"role": "user", "content": message})

        tool_defs = self.tool_registry.get_tool_definitions()
        max_steps = 5
        step = 0
        dashboard_action = None

        tool_called = False
        tool_names_called = []
        tool_result_count = None
        last_result_id = None
        last_supplier_ids = []
        last_search_results = []

        while step < max_steps:
            step += 1
            logger.info(f"Orchestrator step {step}")

            response_msg = self.provider.chat(
                messages=messages,
                tools=tool_defs,
                response_schema=None
            )

            if getattr(response_msg, "tool_calls", None):
                messages.append(response_msg)

                for tool_call in response_msg.tool_calls:
                    name = tool_call.function.name
                    args = json.loads(tool_call.function.arguments)
                    logger.info(f"Executing tool {name} with args {args}")

                    result = self.tool_registry.execute_tool(name, args)
                    tool_called = True
                    tool_names_called.append(name)

                    if name == "search_suppliers":
                        try:
                            parsed_result = json.loads(result)
                            if parsed_result.get("success") and "results" in parsed_result:
                                tool_result_count = parsed_result.get("total", 0)
                                last_result_id = parsed_result.get("result_id")
                                last_supplier_ids = parsed_result.get("supplier_ids", [])
                                last_search_results = parsed_result.get("results", [])

                                # Retain searched parameters in structured state
                                if args.get("quantity_tonnes"):
                                    session["selected_quantity_tonnes"] = float(args["quantity_tonnes"])
                                if args.get("location"):
                                    session["selected_delivery_location"] = str(args["location"])

                                dashboard_action = DashboardAction(
                                    type="SHOW_SUPPLIER_RESULTS",
                                    payload={
                                        "result_id": last_result_id,
                                        "results": last_search_results
                                    }
                                )
                        except (json.JSONDecodeError, KeyError) as e:
                            logger.error(f"Failed to parse search_suppliers result: {e}")

                    elif name == "create_order":
                        try:
                            parsed_order = json.loads(result)
                            if parsed_order.get("success"):
                                session["last_order_id"] = parsed_order.get("order_id")
                                session["last_action"] = "ORDER_CREATED"
                                dashboard_action = DashboardAction(
                                    type="SHOW_ORDER",
                                    payload={"order_id": parsed_order.get("order_id")}
                                )
                        except Exception as e:
                            logger.error(f"Failed to parse create_order result: {e}")

                    elif name == "track_order":
                        try:
                            parsed_track = json.loads(result)
                            if parsed_track.get("success") and parsed_track.get("order_id"):
                                session["last_order_id"] = parsed_track.get("order_id")
                                session["last_action"] = "ORDER_TRACKED"
                                dashboard_action = DashboardAction(
                                    type="SHOW_ORDER",
                                    payload={"order_id": parsed_track.get("order_id")}
                                )
                        except Exception as e:
                            logger.error(f"Failed to parse track_order result: {e}")

                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": name,
                        "content": result
                    })
            else:
                final_content = getattr(response_msg, "content", response_msg)
                if not isinstance(final_content, str):
                    final_content = str(final_content)

                tool_state_note = ""
                if tool_called:
                    tool_state_note = f"\n\nIMPORTANT CONTEXT: Tools were called during this conversation: {', '.join(tool_names_called)}. The response is based on real backend data."
                    if tool_result_count is not None:
                        tool_state_note += f" The supplier search returned {tool_result_count} result(s)."
                else:
                    tool_state_note = "\n\nIMPORTANT CONTEXT: No marketplace tools were called. The assistant must NOT claim any marketplace data was searched or retrieved."

                extraction_prompt = [
                    {
                        "role": "system",
                        "content": (
                            "You are a formatter. Extract the intent and language from the provided assistant message. "
                            "The intent must be one of: FIND_SUPPLIER, CREATE_ORDER, TRACK_ORDER, GET_ROUTE, CREATE_ALERT, CHAT, UNKNOWN. "
                            "Keep the 'message' field EXACTLY as the provided assistant message."
                            f"{tool_state_note}"
                        )
                    },
                    {
                        "role": "user",
                        "content": f"Assistant Message: {final_content}"
                    }
                ]

                final_structured = self.provider.chat(
                    messages=extraction_prompt,
                    response_schema=ChatIntentResponse
                )

                if dashboard_action:
                    final_structured.dashboard_action = dashboard_action

                # Update session
                session["last_intent"] = final_structured.intent
                if last_result_id:
                    session["last_result_id"] = last_result_id
                if last_supplier_ids:
                    session["last_supplier_ids"] = last_supplier_ids
                if last_search_results:
                    session["last_search_results"] = last_search_results
                    session["last_action"] = "SHOW_SUPPLIER_RESULTS"

                messages.append({"role": "assistant", "content": final_content})
                session["messages"] = [messages[0]] + messages[-9:] if len(messages) > 10 else messages

                self.memory.save_session(self.session_id, session)

                logger.info(
                    f"CHAT_RESPONSE intent={final_structured.intent} "
                    f"tool_called={tool_called} tools={tool_names_called} "
                    f"result_count={tool_result_count}"
                )

                return final_structured

        return ChatIntentResponse(
            message="I needed too much time to process that. Please try asking again.",
            intent="ERROR"
        )
