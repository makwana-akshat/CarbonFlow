from app.core.config import settings
from supabase import create_client, Client
from typing import List, Optional

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class MarketplaceRepository:
    @property
    def db(self) -> Client:
        return get_supabase_client()

    # Listings
    def get_active_listings(
        self,
        min_purity: Optional[float] = None,
        max_price: Optional[float] = None,
        min_quantity: Optional[float] = None,
        max_quantity: Optional[float] = None,
        search_query: Optional[str] = None,
        verified_only: Optional[bool] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        query = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role, organisation)", count="exact").eq("status", "active")
        
        if min_purity is not None:
            query = query.gte("purity_percentage", min_purity)
        if max_price is not None:
            query = query.lte("price_per_ton", max_price)
        if min_quantity is not None:
            query = query.gte("volume_tpa", min_quantity)
        if max_quantity is not None:
            query = query.lte("volume_tpa", max_quantity)
        
        # In a real app we might do text search on facility_name, here we do a basic ilike if search_query
        if search_query:
            query = query.ilike("facility_name", f"%{search_query}%")
            
        if sort_by:
            if sort_by == 'purityDesc':
                query = query.order("purity_percentage", desc=True)
            elif sort_by == 'priceAsc':
                query = query.order("price_per_ton", desc=False)
            elif sort_by == 'priceDesc':
                query = query.order("price_per_ton", desc=True)
            elif sort_by == 'quantityDesc':
                query = query.order("volume_tpa", desc=True)
        else:
            query = query.order("created_at", desc=True)
            
        # Pagination
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

    def get_listing_by_id(self, listing_id: str) -> Optional[dict]:
        response = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role, organisation)").eq("id", listing_id).execute()
        return response.data[0] if response.data else None

    def create_listing(self, data: dict) -> dict:
        response = self.db.table("co2_listings").insert(data).execute()
        return response.data[0]

    def update_listing(self, listing_id: str, data: dict) -> dict:
        response = self.db.table("co2_listings").update(data).eq("id", listing_id).execute()
        return response.data[0] if response.data else None

    def delete_listing(self, listing_id: str) -> None:
        # Soft delete by setting status to inactive
        self.db.table("co2_listings").update({"status": "inactive"}).eq("id", listing_id).execute()

    # Requests
    def get_active_requests(
        self,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        query = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role, organisation)", count="exact").eq("status", "active")
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

    def get_requests_by_buyer(self, buyer_id: str) -> List[dict]:
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role, organisation)").eq("buyer_id", buyer_id).order("created_at", desc=True).execute()
        return response.data

    def get_request_by_id(self, request_id: str) -> Optional[dict]:
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role, organisation)").eq("id", request_id).execute()
        return response.data[0] if response.data else None

    def create_request(self, data: dict) -> dict:
        response = self.db.table("co2_requests").insert(data).execute()
        return response.data[0]
        
    def update_request(self, request_id: str, data: dict) -> dict:
        response = self.db.table("co2_requests").update(data).eq("id", request_id).execute()
        return response.data[0] if response.data else None
        
    def delete_request(self, request_id: str) -> None:
        # Soft delete by setting status to cancelled
        self.db.table("co2_requests").update({"status": "cancelled"}).eq("id", request_id).execute()
