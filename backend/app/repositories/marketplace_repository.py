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
        query = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role)", count="exact").eq("status", "active")
        
        if min_purity is not None:
            query = query.gte("purity_percentage", min_purity)
        if max_price is not None:
            query = query.lte("price_per_ton", max_price)
        if min_quantity is not None:
            query = query.gte("volume_tpa", min_quantity)
        if max_quantity is not None:
            query = query.lte("volume_tpa", max_quantity)
        
        if search_query:
            query = query.or_(f"facility_name.ilike.%{search_query}%,co2_grade.ilike.%{search_query}%")
            
        if sort_by:
            if sort_by == 'purityDesc':
                query = query.order("purity_percentage", desc=True)
            elif sort_by == 'priceAsc':
                query = query.order("price_per_ton", desc=False)
            elif sort_by == 'priceDesc':
                query = query.order("price_per_ton", desc=True)
            elif sort_by == 'quantityDesc':
                query = query.order("volume_tpa", desc=True)
            elif sort_by == 'distanceAsc':
                # Mock geospatial sorting by falling back to cheapest price for now
                query = query.order("price_per_ton", desc=False)
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

    def get_listings_by_supplier(
        self,
        supplier_id: str,
        status_filter: Optional[str] = None,
        search_query: Optional[str] = None
    ) -> dict:
        # Base query for counts
        all_listings_resp = self.db.table("co2_listings").select("status").eq("supplier_id", supplier_id).execute()
        counts = {"all": 0, "active": 0, "paused": 0, "draft": 0, "sold_out": 0}
        
        if all_listings_resp and all_listings_resp.data:
            for row in all_listings_resp.data:
                counts["all"] += 1
                s = row.get("status")
                if s in counts:
                    counts[s] += 1
                else:
                    counts[s] = 1 # Just in case other statuses exist

        # Main query for items
        query = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role)").eq("supplier_id", supplier_id)
        
        if status_filter and status_filter != "all":
            query = query.eq("status", status_filter)
            
        if search_query:
            query = query.or_(f"facility_name.ilike.%{search_query}%,location.ilike.%{search_query}%,source_type.ilike.%{search_query}%,co2_grade.ilike.%{search_query}%")
            
        query = query.order("created_at", desc=True)
        response = query.execute()
        
        return {
            "items": response.data,
            "counts": counts
        }

    def get_listing_by_id(self, listing_id: str) -> Optional[dict]:
        response = self.db.table("co2_listings").select("*, users!inner(first_name, last_name, email, role)").eq("id", listing_id).execute()
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
        min_purity: Optional[float] = None,
        max_price: Optional[float] = None,
        min_quantity: Optional[float] = None,
        max_quantity: Optional[float] = None,
        search_query: Optional[str] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        query = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role)", count="exact").eq("status", "active").is_("listing_id", "null")
        
        if min_purity is not None:
            query = query.gte("min_purity_required", min_purity)
        if max_price is not None:
            query = query.lte("target_price", max_price)
        if min_quantity is not None:
            query = query.gte("volume_needed", min_quantity)
        if max_quantity is not None:
            query = query.lte("volume_needed", max_quantity)
            
        if search_query:
            query = query.or_(f"application.ilike.%{search_query}%,title.ilike.%{search_query}%,location.ilike.%{search_query}%")
            
        if sort_by:
            if sort_by == 'purityDesc':
                query = query.order("min_purity_required", desc=True)
            elif sort_by == 'priceAsc':
                query = query.order("target_price", desc=False)
            elif sort_by == 'priceDesc':
                query = query.order("target_price", desc=True)
            elif sort_by == 'quantityDesc':
                query = query.order("volume_needed", desc=True)
            elif sort_by == 'distanceAsc':
                # Mock geospatial sorting by falling back to lowest quantity needed
                query = query.order("volume_needed", desc=False)
        else:
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
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role)").eq("buyer_id", buyer_id).order("created_at", desc=True).execute()
        return response.data

    def get_supplier_inquiries(self, supplier_id: str) -> List[dict]:
        # 1. Get all listing IDs for this supplier
        listings_res = self.db.table("co2_listings").select("id, facility_name").eq("supplier_id", supplier_id).execute()
        if not listings_res.data:
            return []
            
        listing_ids = [l["id"] for l in listings_res.data]
        listing_map = {l["id"]: l["facility_name"] for l in listings_res.data}
        
        # 2. Get all requests targeting those listings
        # We join users to get the buyer's details
        inquiries_res = self.db.table("co2_requests").select("*, users!buyer_id(first_name, last_name, email, company_name)").in_("listing_id", listing_ids).order("created_at", desc=True).execute()
        
        results = []
        for inq in inquiries_res.data:
            inq["listing_name"] = listing_map.get(inq.get("listing_id"))
            inq["supplier_id"] = supplier_id
            results.append(inq)
            
        return results

    def get_request_by_id(self, request_id: str) -> Optional[dict]:
        response = self.db.table("co2_requests").select("*, users!inner(first_name, last_name, email, role)").eq("id", request_id).execute()
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
