from app.core.config import settings
from supabase import create_client, Client
from typing import List

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class MarketplaceRepository:
    @property
    def db(self) -> Client:
        return get_supabase_client()

    # Listings
    def get_active_listings(self) -> List[dict]:
        response = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role)").eq("status", "active").execute()
        return response.data

    def create_listing(self, data: dict) -> dict:
        response = self.db.table("co2_listings").insert(data).execute()
        return response.data[0]

    # Requests
    def get_active_requests(self) -> List[dict]:
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role)").eq("status", "active").execute()
        return response.data

    def get_requests_by_buyer(self, buyer_id: str) -> List[dict]:
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role)").eq("buyer_id", buyer_id).execute()
        return response.data

    def create_request(self, data: dict) -> dict:
        response = self.db.table("co2_requests").insert(data).execute()
        return response.data[0]
