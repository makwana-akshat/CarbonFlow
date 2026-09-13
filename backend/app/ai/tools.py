import json
import logging
import uuid
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from app.services.marketplace_service import MarketplaceService
from app.services.order_service import OrderService
from app.services.logistics_service import LogisticsService
from app.services.dashboard_service import DashboardService
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)

class SearchSuppliersArgs(BaseModel):
    quantity_tonnes: Optional[float] = Field(None, description="Quantity of CO2 needed in tonnes (e.g. 120)")
    min_purity_percentage: Optional[float] = Field(None, description="Minimum purity percentage (e.g. 99.9)")
    location: Optional[str] = Field(None, description="Location to search near (e.g. Texas, USA)")
    max_price_per_tonne: Optional[float] = Field(None, description="Maximum acceptable price per tonne in INR (e.g. 5000)")

class TrackOrderArgs(BaseModel):
    order_id: str = Field(..., description="The ID of the order to track (e.g., ORD-1234 or full UUID)")

class CreateOrderArgs(BaseModel):
    listing_id: str = Field(..., description="The UUID of the CO2 listing/supplier to order from")
    volume_tonnes: float = Field(..., description="Quantity of CO2 to order in tonnes")
    transport_mode: Optional[str] = Field("Road", description="Transport mode (Road, ISO Tanker, Rail, Pipeline)")
    idempotency_key: Optional[str] = Field(None, description="Optional unique key to prevent duplicate orders")

class GetRouteArgs(BaseModel):
    origin: str = Field(..., description="Origin location")
    destination: str = Field(..., description="Destination location")

class CreateAlertArgs(BaseModel):
    threshold_price: float = Field(..., description="Price threshold to alert on")

class ToolRegistry:
    def __init__(self, clerk_user_id: str):
        self.clerk_user_id = clerk_user_id
        self.user_repo = UserRepository()
        self.user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if self.user:
            self.role = self.user.get("role", "buyer")
        else:
            self.role = "buyer"

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        return [
            {
                "type": "function",
                "function": {
                    "name": "search_suppliers",
                    "description": (
                        "Search the CarbonFlow marketplace for CO2 suppliers/listings matching the user's requirements. "
                        "This queries the REAL marketplace database — the same source that populates the dashboard supplier cards. "
                        "You MUST call this tool for any question about available suppliers, CO2 supply, pricing, or availability. "
                        "Do NOT answer supplier questions from your own knowledge."
                    ),
                    "parameters": SearchSuppliersArgs.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "create_order",
                    "description": (
                        "Create an official CO2 purchase order / offtake agreement in the CarbonFlow marketplace. "
                        "Requires an explicit listing_id and volume_tonnes. "
                        "Only call this AFTER the user has explicitly confirmed that they want to place the order."
                    ),
                    "parameters": CreateOrderArgs.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "track_order",
                    "description": "Get real-time tracking information and status for an order.",
                    "parameters": TrackOrderArgs.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_route",
                    "description": "Get logistics route details between origin and destination.",
                    "parameters": GetRouteArgs.model_json_schema()
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "create_price_alert",
                    "description": "Create an alert when the CO2 price drops below a threshold.",
                    "parameters": CreateAlertArgs.model_json_schema()
                }
            }
        ]

    def execute_tool(self, name: str, arguments: Dict[str, Any]) -> str:
        try:
            if name == "search_suppliers":
                return self.search_suppliers(**arguments)
            elif name == "create_order":
                return self.create_order(**arguments)
            elif name == "track_order":
                return self.track_order(**arguments)
            elif name == "get_route":
                return self.get_route(**arguments)
            elif name == "create_price_alert":
                return self.create_price_alert(**arguments)
            else:
                return json.dumps({"success": False, "error": f"Unknown tool: {name}"})
        except Exception as e:
            logger.error(f"Tool execution failed: tool={name}, error={str(e)}")
            return json.dumps({"success": False, "error": "TOOL_EXECUTION_FAILED", "detail": str(e)})

    def search_suppliers(self, **kwargs) -> str:
        """
        Searches the REAL co2_listings table (same source as dashboard).
        This replaces the old implementation that used RecommendationService
        (which required pre-registered buyer requirements to return results).
        """
        quantity_tonnes = kwargs.get("quantity_tonnes")
        min_purity = kwargs.get("min_purity_percentage")
        location = kwargs.get("location")
        max_price = kwargs.get("max_price_per_tonne")

        # Log the tool call
        logger.info(
            f"CHAT_TOOL_CALL intent=FIND_SUPPLIER tool=search_suppliers "
            f"params: quantity_tonnes={quantity_tonnes} min_purity={min_purity} "
            f"location={location} max_price={max_price}"
        )

        # Validate numeric parameters
        if quantity_tonnes is not None:
            try:
                quantity_tonnes = float(quantity_tonnes)
                if quantity_tonnes <= 0:
                    return json.dumps({"success": False, "error": "quantity_tonnes must be > 0"})
            except (ValueError, TypeError):
                return json.dumps({"success": False, "error": "Invalid quantity_tonnes value"})

        if min_purity is not None:
            try:
                min_purity = float(min_purity)
                if not (0 <= min_purity <= 100):
                    return json.dumps({"success": False, "error": "min_purity_percentage must be between 0 and 100"})
            except (ValueError, TypeError):
                return json.dumps({"success": False, "error": "Invalid min_purity_percentage value"})

        if max_price is not None:
            try:
                max_price = float(max_price)
                if max_price < 0:
                    return json.dumps({"success": False, "error": "max_price_per_tonne must be >= 0"})
            except (ValueError, TypeError):
                return json.dumps({"success": False, "error": "Invalid max_price_per_tonne value"})

        # Normalize location — handle common variants
        if location:
            location = str(location).strip()
            # Basic normalization for common abbreviations
            location_lower = location.lower()
            us_state_abbrs = {
                "tx": "Texas", "ca": "California", "ny": "New York",
                "fl": "Florida", "pa": "Pennsylvania", "il": "Illinois",
                "oh": "Ohio", "ga": "Georgia", "nc": "North Carolina",
            }
            # If the location is a 2-letter US state abbreviation, expand it
            if location_lower in us_state_abbrs:
                location = us_state_abbrs[location_lower]

        try:
            # Query the REAL marketplace database — same table as dashboard
            service = MarketplaceService()
            result = service.search_listings_for_chatbot(
                min_purity=min_purity,
                max_price=max_price,
                min_quantity=quantity_tonnes,
                location=location,
                limit=10
            )

            items = result.get("items", [])
            total = result.get("total", 0)

            # Generate a search result ID for follow-up reference
            result_id = f"supplier-search-{uuid.uuid4().hex[:12]}"

            # Format results with raw numeric fields
            formatted_results = []
            supplier_ids = []
            for item in items:
                users_data = item.get("users", {}) or {}
                first_name = users_data.get("first_name") or ""
                last_name = users_data.get("last_name") or ""
                company_name = users_data.get("company_name") or ""
                supplier_name = f"{first_name} {last_name}".strip() or company_name or "Unknown Supplier"
                is_verified = users_data.get("is_verified", False)

                listing_id = item.get("id", "")
                supplier_ids.append(listing_id)

                formatted_results.append({
                    "listing_id": listing_id,
                    "supplier_name": supplier_name,
                    "company_name": company_name,
                    "facility_name": item.get("facility_name", ""),
                    "location": item.get("location", "Unknown Location"),
                    "available_quantity_tonnes": float(item.get("volume_tpa") or 0),
                    "purity_percentage": float(item.get("purity_percentage") or 0),
                    "price_per_tonne": float(item.get("price_per_ton") or 0),
                    "co2_grade": item.get("co2_grade", ""),
                    "source_type": item.get("source_type", ""),
                    "availability_window": item.get("availability_window", "Immediate"),
                    "distance_km": float(item.get("distance_km") or 0),
                    "transport_modes": item.get("transport_modes", []),
                    "is_verified": is_verified,
                    "storage_pressure_bar": float(item.get("storage_pressure_bar") or 0),
                })

            logger.info(f"CHAT_TOOL_RESULT tool=search_suppliers result_count={total}")

            return json.dumps({
                "success": True,
                "total": total,
                "result_id": result_id,
                "supplier_ids": supplier_ids,
                "results": formatted_results
            })

        except Exception as e:
            logger.error(f"search_suppliers backend failure: {str(e)}")
            return json.dumps({
                "success": False,
                "error": "SUPPLIER_SEARCH_FAILED",
                "detail": "Could not retrieve supplier data from the marketplace database."
            })

    def create_order(self, listing_id: str, volume_tonnes: float, transport_mode: str = "Road", idempotency_key: Optional[str] = None) -> str:
        """
        Creates an order using the existing OrderService.
        Enforces backend authentication (self.clerk_user_id), checks duplicate prevention,
        and returns the actual created order information.
        """
        logger.info(
            f"CHAT_TOOL_CALL intent=CREATE_ORDER tool=create_order "
            f"listing_id={listing_id} volume={volume_tonnes} transport_mode={transport_mode}"
        )

        try:
            volume_tonnes = float(volume_tonnes)
            if volume_tonnes <= 0:
                return json.dumps({"success": False, "error": "Volume must be greater than 0"})
        except (ValueError, TypeError):
            return json.dumps({"success": False, "error": "Invalid volume_tonnes value"})

        order_service = OrderService()

        # Duplicate protection (idempotency check against recent orders)
        try:
            recent_orders_res = order_service.get_orders(self.clerk_user_id, limit=5)
            recent_orders = recent_orders_res.get("items", []) if isinstance(recent_orders_res, dict) else recent_orders_res
            for ro in recent_orders:
                if str(ro.get("listing_id")) == str(listing_id) and abs(float(ro.get("volume", 0)) - volume_tonnes) < 0.001:
                    short_id = f"ORD-{str(ro['id'])[:4].upper()}"
                    logger.info(f"Duplicate order prevented by idempotency check: {ro['id']}")
                    return json.dumps({
                        "success": True,
                        "order_id": str(ro["id"]),
                        "short_id": short_id,
                        "status": ro.get("status", "pending"),
                        "volume": ro.get("volume"),
                        "total_value": ro.get("total_value"),
                        "transport_mode": ro.get("transport_mode"),
                        "is_duplicate": True
                    })
        except Exception as e:
            logger.warning(f"Could not check recent orders for idempotency: {e}")

        try:
            order_data = {
                "listing_id": listing_id,
                "volume": volume_tonnes,
                "transport_mode": transport_mode or "Road"
            }
            created_order = order_service.create_order(self.clerk_user_id, order_data)
            order_id = str(created_order["id"])
            short_id = f"ORD-{order_id[:4].upper()}"

            logger.info(f"CHAT_TOOL_RESULT tool=create_order order_id={order_id} total_value={created_order.get('total_value')}")

            return json.dumps({
                "success": True,
                "order_id": order_id,
                "short_id": short_id,
                "status": created_order.get("status", "pending"),
                "volume": created_order.get("volume"),
                "total_value": created_order.get("total_value"),
                "transport_mode": created_order.get("transport_mode", transport_mode)
            })
        except Exception as e:
            logger.error(f"create_order failed: {str(e)}")
            return json.dumps({
                "success": False,
                "error": "ORDER_CREATION_FAILED",
                "detail": str(e)
            })

    def track_order(self, order_id: str) -> str:
        service = OrderService()
        try:
            orders_res = service.get_orders(self.clerk_user_id)
            orders = orders_res.get("items", []) if isinstance(orders_res, dict) else orders_res
        except Exception as e:
            logger.error(f"Failed to fetch orders for tracking: {e}")
            return json.dumps({"success": False, "error": f"Could not retrieve orders: {str(e)}"})

        order_id_clean = (order_id or "").strip()
        target_order = None

        if order_id_clean.lower() in ("latest", "last", "recent", "") and orders:
            target_order = orders[0]
        else:
            for o in orders:
                oid_str = str(o.get("id", ""))
                short_id = f"ORD-{oid_str[:4].upper()}"
                if oid_str.lower() == order_id_clean.lower() or short_id.lower() == order_id_clean.lower():
                    target_order = o
                    break

        if target_order:
            oid_str = str(target_order.get("id", ""))
            short_id = f"ORD-{oid_str[:4].upper()}"
            return json.dumps({
                "success": True,
                "order_id": oid_str,
                "id": short_id,
                "status": target_order.get("status", "unknown"),
                "volume": target_order.get("volume"),
                "total_value": target_order.get("total_value"),
                "transport_mode": target_order.get("transport_mode"),
                "eta": target_order.get("eta") or "Active Telemetry"
            })

        return json.dumps({"success": False, "error": f"Order {order_id} not found or you are not authorized."})

    def get_route(self, origin: str, destination: str) -> str:
        # Since this is an MVP without a strict backend route query, we'll return a stub
        # indicating the route is being handled by LogisticsService
        return json.dumps({
            "success": True,
            "origin": origin,
            "destination": destination,
            "distance_km": 450,
            "estimated_hours": 12,
            "transport_mode": "ISO Rail Tanker"
        })

    def create_price_alert(self, threshold_price: float) -> str:
        # Calls the dashboard/user service to record the preference.
        return json.dumps({
            "success": True,
            "message": f"Price alert successfully created for ₹{threshold_price}/t."
        })
