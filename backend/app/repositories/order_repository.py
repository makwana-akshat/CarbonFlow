from app.core.config import settings
from supabase import create_client, Client
from typing import List

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class OrderRepository:
    @property
    def db(self) -> Client:
        return get_supabase_client()

    def get_active_orders(self, user_id: str, role: str) -> List[dict]:
        query = self.db.table("orders").select("*, supplier:supplier_id(first_name, last_name, email), buyer:buyer_id(first_name, last_name, email)")
        if role == "buyer":
            query = query.eq("buyer_id", user_id)
        elif role == "supplier":
            query = query.eq("supplier_id", user_id)
        
        # 'active' usually means pending, in transit, etc.
        # We can just fetch all for now or filter by specific statuses.
        response = query.neq("status", "completed").execute()
        return response.data

    def create_order(self, data: dict) -> dict:
        response = self.db.table("orders").insert(data).execute()
        return response.data[0]
