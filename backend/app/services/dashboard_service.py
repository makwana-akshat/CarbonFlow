from app.repositories.user_repository import UserRepository
from app.repositories.order_repository import OrderRepository
from app.repositories.marketplace_repository import MarketplaceRepository

class DashboardService:
    def __init__(self):
        self.user_repo = UserRepository()
        self.order_repo = OrderRepository()
        self.market_repo = MarketplaceRepository()

    def get_summary(self, clerk_user_id: str):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")

        role = user["role"]
        
        # We can calculate dynamic KPIs based on the DB, or return hardcoded realistic data for now
        # until the DB is fully populated with historical transactions.
        
        if role == "buyer":
            kpis = [
                {"id": "co2-req", "label": "CO₂ Required", "value": "24,500 t", "trend": {"value": "+8.2%", "isPositive": True}, "period": "vs last month"},
                {"id": "rec-suppliers", "label": "Recommended Suppliers", "value": "14", "trend": {"value": "+3 new", "isPositive": True}, "period": "verified matches"},
                {"id": "active-orders", "label": "Active Orders", "value": "6", "trend": {"value": "2 in transit", "isPositive": True}, "period": "ISO rail tankers"},
                {"id": "avg-cost", "label": "Avg Procurement Cost", "value": "$41.80/t", "trend": {"value": "-4.5%", "isPositive": True}, "period": "below index avg"}
            ]
        else: # supplier
            kpis = [
                {"id": "available-co2", "label": "Available CO₂", "value": "68,200 t", "trend": {"value": "+12.4%", "isPositive": True}, "period": "capture rate"},
                {"id": "active-listings", "label": "Active Listings", "value": "9", "trend": {"value": "+2 this week", "isPositive": True}, "period": "spot & contracts"},
                {"id": "buyer-requests", "label": "Buyer Requests", "value": "28", "trend": {"value": "+18.2%", "isPositive": True}, "period": "pending offtakes"},
                {"id": "co2-sold", "label": "CO₂ Sold YTD", "value": "142,800 t", "trend": {"value": "+21.6%", "isPositive": True}, "period": "YoY contracted"}
            ]
            
        return {
            "kpis": kpis,
            "market_prices": [
                {"month": "Oct", "price": 34.2, "benchmark": 35.0},
                {"month": "Nov", "price": 35.8, "benchmark": 36.1},
                {"month": "Dec", "price": 37.4, "benchmark": 36.8},
                {"month": "Jan", "price": 39.0, "benchmark": 38.0},
                {"month": "Feb", "price": 38.5, "benchmark": 38.9},
                {"month": "Mar", "price": 40.2, "benchmark": 40.0},
                {"month": "Apr", "price": 41.0, "benchmark": 40.8},
                {"month": "May", "price": 41.8, "benchmark": 41.2, "isSelected": True}
            ]
        }
