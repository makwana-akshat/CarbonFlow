from app.repositories.user_repository import UserRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.marketplace_repository import MarketplaceRepository

from app.core.config import settings
from supabase import create_client
from datetime import datetime, timedelta
from app.ai.provider import LLMProvider
from app.ai.prompts import CARBONFLOW_AI_INSIGHT_PROMPT_V1
from pydantic import BaseModel

def get_supabase_client():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class AIInsightResponse(BaseModel):
    title: str
    insight: str

class DashboardService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.order_repo = OrderRepository()
        self.market_repo = MarketplaceRepository()
        self.db = get_supabase_client()
        
    def _get_internal_user_id(self, clerk_id: str):
        user = self.user_repo.get_by_clerk_id(clerk_id)
        if not user:
            raise Exception("User not found")
        return user

    def get_kpis(self, clerk_user_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        role = user["role"]
        user_id = user["id"]
        
        if role == "buyer":
            req_count = self.db.table("co2_requests").select("id", count="exact").eq("buyer_id", user_id).execute().count or 0
            matches_count = self.db.table("recommendations").select("id", count="exact").eq("user_id", user_id).execute().count or 0
            active_orders_count = self.db.table("orders").select("id", count="exact").eq("buyer_id", user_id).neq("status", "completed").neq("status", "cancelled").execute().count or 0
            match_rate = f"{(matches_count / req_count * 100):.1f}%" if req_count > 0 else "0.0%"
            
            kpis = [
                {"id": "req-posted", "label": "Total Requirements Posted", "value": str(req_count), "trend": {"value": "+0 new", "isPositive": True}, "period": "from last month"},
                {"id": "matches-found", "label": "Matches Found", "value": str(matches_count), "trend": {"value": "+0", "isPositive": True}, "period": "from last month"},
                {"id": "active-orders", "label": "Active Orders", "value": str(active_orders_count), "trend": {"value": "0 new", "isPositive": True}, "period": "from last month"},
                {"id": "match-rate", "label": "Match Rate", "value": match_rate, "trend": {"value": "+0.0%", "isPositive": True}, "period": "from last month"}
            ]
            
            active_reqs = self.db.table("co2_requests").select("id", count="exact").eq("buyer_id", user_id).eq("status", "active").execute().count or 0
            completed_offtakes = self.db.table("orders").select("id", count="exact").eq("buyer_id", user_id).eq("status", "completed").execute().count or 0
            summary_breakdown = [
                {"label": "Active Requirements", "count": active_reqs},
                {"label": "Pending Matches", "count": matches_count},
                {"label": "Completed Offtakes", "count": completed_offtakes},
            ]
        else: # supplier
            listings_count = self.db.table("co2_listings").select("id", count="exact").eq("supplier_id", user_id).eq("status", "active").execute().count or 0
            buyer_requests = self.db.table("recommendations").select("id", count="exact").eq("user_id", user_id).execute().count or 0
            active_orders_count = self.db.table("orders").select("id", count="exact").eq("supplier_id", user_id).neq("status", "completed").neq("status", "cancelled").execute().count or 0
            conversion_rate = f"{(active_orders_count / buyer_requests * 100):.1f}%" if buyer_requests > 0 else "0.0%"
            
            kpis = [
                {"id": "listing-views", "label": "Active Listings", "value": str(listings_count), "trend": {"value": "+0 this week", "isPositive": True}, "period": "from last month"},
                {"id": "buyer-requests", "label": "Buyer Requests", "value": str(buyer_requests), "trend": {"value": "+0", "isPositive": True}, "period": "from last month"},
                {"id": "active-orders", "label": "Active Orders", "value": str(active_orders_count), "trend": {"value": "0 new", "isPositive": True}, "period": "from last month"},
                {"id": "conversion-rate", "label": "Conversion Rate", "value": conversion_rate, "trend": {"value": "+0.0%", "isPositive": True}, "period": "from last month"}
            ]
            
            pending_inquiries = buyer_requests
            fulfilled_contracts = self.db.table("orders").select("id", count="exact").eq("supplier_id", user_id).eq("status", "completed").execute().count or 0
            summary_breakdown = [
                {"label": "Active Listings", "count": listings_count},
                {"label": "Pending Inquiries", "count": pending_inquiries},
                {"label": "Fulfilled Contracts", "count": fulfilled_contracts},
            ]
            
        return {
            "kpis": kpis,
            "summaryBreakdown": summary_breakdown
        }

    def get_supply_demand(self, clerk_user_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        role = user["role"]
        user_id = user["id"]
        
        chart_data = []
        orders_resp = self.db.table("orders").select("created_at, total_value, volume").eq("buyer_id" if role == "buyer" else "supplier_id", user_id).execute()
        orders = orders_resp.data if orders_resp else []
        
        today = datetime.today()
        months = []
        for i in range(11, -1, -1):
            month_offset = today.month - i - 1
            y = today.year + (month_offset // 12)
            m = (month_offset % 12) + 1
            dt = datetime(year=y, month=m, day=1)
            months.append({
                "date_str": dt.strftime("%Y-%m"),
                "label": dt.strftime("%b"),
                "date_full": dt.strftime("%b %Y"),
                "value": 0
            })
            
        for order in orders:
            try:
                order_dt = datetime.fromisoformat(order["created_at"].replace("Z", "+00:00"))
                order_month = order_dt.strftime("%Y-%m")
                for m in months:
                    if m["date_str"] == order_month:
                        m["value"] += float(order["total_value"]) if role == "buyer" else float(order["volume"])
            except Exception:
                pass
                
        prev_value = 0
        for m in months:
            val = m["value"]
            if prev_value == 0:
                delta_val = 0
            else:
                delta_val = ((val - prev_value) / prev_value) * 100
            
            is_positive = delta_val >= 0
            delta_str = f"+{delta_val:.1f}%" if is_positive else f"{delta_val:.1f}%"
            formatted_val = f"₹{val:,.0f}" if role == "buyer" else f"{val:,.0f} t"
            
            chart_data.append({
                "date": m["date_full"],
                "label": m["label"],
                "value": val,
                "formattedValue": formatted_val,
                "delta": delta_str,
                "isPositive": is_positive
            })
            prev_value = val

        return {"items": chart_data}
        
    def get_market_prices(self, clerk_user_id: str):
        # Empty array since frontend doesn't need market-prices chart right now
        return {"items": []}
        
    def get_alerts(self, clerk_user_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        role = user["role"]
        user_id = user["id"]
        
        alerts = []
        
        # Get latest 4 orders
        orders_resp = self.db.table("orders").select("id, status, created_at, volume, supplier:supplier_id(first_name, last_name), buyer:buyer_id(first_name, last_name)").eq("buyer_id" if role == "buyer" else "supplier_id", user_id).order("created_at", desc=True).limit(4).execute()
        
        if orders_resp and orders_resp.data:
            for o in orders_resp.data:
                counterparty_data = o["supplier"] if role == "buyer" else o["buyer"]
                counterparty = f"{counterparty_data.get('first_name', '')} {counterparty_data.get('last_name', '')}".strip() if counterparty_data else "Unknown"
                
                # Format time nicely (just placeholder format, normally we'd do a timeago function)
                dt = datetime.fromisoformat(o["created_at"].replace("Z", "+00:00"))
                time_str = dt.strftime("%b %d, %H:%M")
                
                msg = ""
                icon = "Activity"
                if o["status"] == "pending":
                    msg = f"Requested {o['volume']} t offtake quote with {counterparty}" if role == "buyer" else f"Received {o['volume']} t offtake request from {counterparty}"
                    icon = "FileText"
                elif o["status"] == "confirmed":
                    msg = f"Match confirmed: {o['volume']} t agreement with {counterparty}"
                    icon = "CheckCircle2"
                elif o["status"] == "delivered":
                    msg = f"Delivery completed for {o['volume']} t to {counterparty}"
                    icon = "Activity"
                elif o["status"] == "cancelled":
                    msg = f"Order cancelled for {o['volume']} t with {counterparty}"
                    icon = "X"
                else:
                    msg = f"Order {o['status']} for {o['volume']} t with {counterparty}"
                    icon = "Activity"
                
                alerts.append({
                    "id": f"act-{o['id']}",
                    "avatar": (counterparty or "NA")[0:2].upper(),
                    "name": counterparty or "Unknown Company",
                    "description": msg,
                    "time": time_str,
                    "icon": icon
                })
                
        return {"items": alerts}
        
    def get_ai_insight(self, clerk_user_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        role = user["role"]
        
        # Gather context
        active_listings_resp = self.db.table("co2_listings").select("volume_tpa").eq("status", "active").execute()
        active_requests_resp = self.db.table("co2_requests").select("volume_needed").eq("status", "active").execute()
        
        total_supply = sum([float(x["volume_tpa"]) for x in active_listings_resp.data]) if active_listings_resp and active_listings_resp.data else 0
        total_demand = sum([float(x["volume_needed"]) for x in active_requests_resp.data]) if active_requests_resp and active_requests_resp.data else 0
        
        # Base fallback
        if total_supply > total_demand:
            diff = total_supply - total_demand
            title = "Oversupply Detected"
            msg = f"The network currently has {diff:,.0f} t more active supply than demand. It is a buyer's market."
        else:
            diff = total_demand - total_supply
            title = "Shortage Risk Detected"
            msg = f"The network currently has {diff:,.0f} t more active demand than supply. Expect spot premiums."
            
        try:
            llm = LLMProvider()
            if not llm.is_available():
                return {"title": title, "insight": msg}
                
            context = f"Current Role: {role}\nTotal Active Supply: {total_supply:,.0f} t\nTotal Active Demand: {total_demand:,.0f} t\nDifference: {abs(total_supply - total_demand):,.0f} t"
            
            structured_response = llm.generate(
                system_prompt=CARBONFLOW_AI_INSIGHT_PROMPT_V1,
                user_prompt=context,
                response_schema=AIInsightResponse
            )
            
            return {
                "title": structured_response.title,
                "insight": structured_response.insight
            }
        except Exception:
            return {"title": title, "insight": msg}
