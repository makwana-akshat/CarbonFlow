from app.repositories.user_repository import UserRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.marketplace_repository import MarketplaceRepository

from app.core.config import settings
from supabase import create_client
from datetime import datetime, timedelta

def get_supabase_client():
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class DashboardService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.order_repo = OrderRepository()
        self.market_repo = MarketplaceRepository()
        self.db = get_supabase_client()

    def get_summary(self, clerk_user_id: str):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")

        role = user["role"]
        user_id = user["id"]
        
        if role == "buyer":
            # Total Requirements Posted
            req_count = self.db.table("co2_requests").select("id", count="exact").eq("buyer_id", user_id).execute().count or 0
            
            # Matches Found (recommendations)
            matches_count = self.db.table("recommendations").select("id", count="exact").eq("user_id", user_id).execute().count or 0
            
            # Active Orders
            active_orders_count = self.db.table("orders").select("id", count="exact").eq("buyer_id", user_id).neq("status", "completed").execute().count or 0
            
            # Match Rate
            match_rate = f"{(matches_count / req_count * 100):.1f}%" if req_count > 0 else "0.0%"
            
            kpis = [
                {"id": "req-posted", "label": "Total Requirements Posted", "value": str(req_count), "trend": {"value": "+0 new", "isPositive": True}, "period": "from last month"},
                {"id": "matches-found", "label": "Matches Found", "value": str(matches_count), "trend": {"value": "+0", "isPositive": True}, "period": "from last month"},
                {"id": "active-orders", "label": "Active Orders", "value": str(active_orders_count), "trend": {"value": "0 in transit", "isPositive": True}, "period": "from last month"},
                {"id": "match-rate", "label": "Match Rate", "value": match_rate, "trend": {"value": "+0.0%", "isPositive": True}, "period": "from last month"}
            ]
            
            # Summary Breakdown
            active_reqs = self.db.table("co2_requests").select("id", count="exact").eq("buyer_id", user_id).eq("status", "active").execute().count or 0
            completed_offtakes = self.db.table("orders").select("id", count="exact").eq("buyer_id", user_id).eq("status", "completed").execute().count or 0
            summary_breakdown = [
                {"label": "Active Requirements", "count": active_reqs},
                {"label": "Pending Matches", "count": matches_count},
                {"label": "Completed Offtakes", "count": completed_offtakes},
            ]
            
        else: # supplier
            # Active Listings
            listings_count = self.db.table("co2_listings").select("id", count="exact").eq("supplier_id", user_id).eq("status", "active").execute().count or 0
            
            # Buyer Requests (match count)
            buyer_requests = self.db.table("recommendations").select("id", count="exact").eq("user_id", user_id).execute().count or 0
            
            # Active Orders
            active_orders_count = self.db.table("orders").select("id", count="exact").eq("supplier_id", user_id).neq("status", "completed").execute().count or 0
            
            conversion_rate = f"{(active_orders_count / buyer_requests * 100):.1f}%" if buyer_requests > 0 else "0.0%"
            
            kpis = [
                {"id": "listing-views", "label": "Active Listings", "value": str(listings_count), "trend": {"value": "+0 this week", "isPositive": True}, "period": "from last month"},
                {"id": "buyer-requests", "label": "Buyer Requests", "value": str(buyer_requests), "trend": {"value": "+0", "isPositive": True}, "period": "from last month"},
                {"id": "active-orders", "label": "Active Orders", "value": str(active_orders_count), "trend": {"value": "0 new", "isPositive": True}, "period": "from last month"},
                {"id": "conversion-rate", "label": "Conversion Rate", "value": conversion_rate, "trend": {"value": "+0.0%", "isPositive": True}, "period": "from last month"}
            ]
            
            # Summary Breakdown
            pending_inquiries = buyer_requests
            fulfilled_contracts = self.db.table("orders").select("id", count="exact").eq("supplier_id", user_id).eq("status", "completed").execute().count or 0
            summary_breakdown = [
                {"label": "Active Listings", "count": listings_count},
                {"label": "Pending Inquiries", "count": pending_inquiries},
                {"label": "Fulfilled Contracts", "count": fulfilled_contracts},
            ]
            
        
        # Calculate Chart Data (last 12 months)
        chart_data = []
        orders_resp = self.db.table("orders").select("created_at, total_value, volume").eq("buyer_id" if role == "buyer" else "supplier_id", user_id).execute()
        orders = orders_resp.data if orders_resp else []
        
        today = datetime.today()
        # Create a bucket for each of the last 12 months
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
            
        # Accumulate values
        for order in orders:
            try:
                order_dt = datetime.fromisoformat(order["created_at"].replace("Z", "+00:00"))
                order_month = order_dt.strftime("%Y-%m")
                for m in months:
                    if m["date_str"] == order_month:
                        m["value"] += float(order["total_value"]) if role == "buyer" else float(order["volume"])
            except Exception:
                pass
                
        # Format for frontend
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

        return {
            "kpis": kpis,
            "summaryBreakdown": summary_breakdown,
            "chartData": chart_data
        }
