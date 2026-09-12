from app.core.config import settings
from supabase import create_client, Client
from typing import List

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class OrderRepository:
    @property
    def db(self) -> Client:
        return get_supabase_client()

    def get_orders(
        self,
        user_id: str,
        role: str,
        status: str = None,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        query = self.db.table("orders").select("*, supplier:supplier_id(first_name, last_name, email), buyer:buyer_id(first_name, last_name, email)", count="exact")
        
        if role == "buyer":
            query = query.eq("buyer_id", user_id)
        elif role == "supplier":
            query = query.eq("supplier_id", user_id)
        
        if status:
            query = query.eq("status", status)
            
        query = query.order("created_at", desc=True)
        
        start = (page - 1) * limit
        end = start + limit - 1
        query = query.range(start, end)
        
        response = query.execute()
        return {
            "items": response.data,
            "total": response.count if response.count is not None else len(response.data),
            "page": page,
            "limit": limit
        }

    def get_order_by_id(self, order_id: str) -> dict:
        response = self.db.table("orders").select("*, supplier:supplier_id(first_name, last_name, email), buyer:buyer_id(first_name, last_name, email)").eq("id", order_id).execute()
        if not response.data:
            return None
        return response.data[0]

    def create_order(self, data: dict) -> dict:
        response = self.db.table("orders").insert(data).execute()
        return response.data[0]
        
    def update_order_status(self, order_id: str, new_status: str) -> dict:
        response = self.db.table("orders").update({"status": new_status}).eq("id", order_id).execute()
        if not response.data:
            return None
        return response.data[0]
        
    def delete_order(self, order_id: str):
        self.db.table("orders").delete().eq("id", order_id).execute()
