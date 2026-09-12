from app.repositories.marketplace_repository import MarketplaceRepository
from app.repositories.user_repository import UserRepository

class MarketplaceService:
    def __init__(self):
        self.repo = MarketplaceRepository()
        self.user_repo = UserRepository()

    def _get_internal_user_id(self, clerk_user_id: str) -> str:
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")
        return user["id"]

    def get_active_listings(self, **kwargs):
        return self.repo.get_active_listings(**kwargs)

    def get_my_listings(self, clerk_user_id: str, status_filter: str = None, search_query: str = None):
        user_id = self._get_internal_user_id(clerk_user_id)
        return self.repo.get_listings_by_supplier(user_id, status_filter, search_query)

    def get_listing_by_id(self, listing_id: str):
        listing = self.repo.get_listing_by_id(listing_id)
        if not listing:
            raise Exception("Listing not found")
        return listing

    def create_listing(self, clerk_user_id: str, listing_data: dict):
        user_id = self._get_internal_user_id(clerk_user_id)
        listing_data["supplier_id"] = user_id
        return self.repo.create_listing(listing_data)

    def update_listing(self, clerk_user_id: str, listing_id: str, update_data: dict):
        user_id = self._get_internal_user_id(clerk_user_id)
        listing = self.get_listing_by_id(listing_id)
        if listing["supplier_id"] != user_id:
            raise Exception("Not authorized to update this listing")
            
        return self.repo.update_listing(listing_id, update_data)

    def delete_listing(self, clerk_user_id: str, listing_id: str):
        user_id = self._get_internal_user_id(clerk_user_id)
        listing = self.get_listing_by_id(listing_id)
        if listing["supplier_id"] != user_id:
            raise Exception("Not authorized to delete this listing")
            
        self.repo.delete_listing(listing_id)

    def get_active_requests(self, **kwargs):
        return self.repo.get_active_requests(**kwargs)
    
    def get_my_requests(self, clerk_user_id: str):
        user_id = self._get_internal_user_id(clerk_user_id)
        return self.repo.get_requests_by_buyer(user_id)

    def get_request_by_id(self, request_id: str):
        request = self.repo.get_request_by_id(request_id)
        if not request:
            raise Exception("Request not found")
        return request

    def create_request(self, clerk_user_id: str, request_data: dict):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")
        request_data["buyer_id"] = user["id"]
        # Default company name from organisation if not provided
        # if "buyer_company_name" not in request_data or not request_data["buyer_company_name"]:
        #    request_data["buyer_company_name"] = user.get("organisation", "Unknown Company")
        return self.repo.create_request(request_data)

    def create_inquiry(self, clerk_user_id: str, inquiry_data: dict):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")

        listing = self.repo.get_listing_by_id(inquiry_data["listing_id"])
        if not listing:
            raise ValueError("Target listing not found")
        if listing.get("status") != "active":
            raise ValueError("Target listing is no longer active")

        request_payload = {
            "buyer_id": user["id"],
            "listing_id": inquiry_data["listing_id"],
            "volume_needed": inquiry_data["volume_needed"],
            "delivery_method": inquiry_data["transport_mode"],
            "required_by_date": inquiry_data["delivery_date"] or None,
            "application": inquiry_data.get("notes") or "Offtake Inquiry",
            "title": f"Inquiry for {listing['facility_name']}",
            "required_grade": listing["co2_grade"],
            "target_price": listing["price_per_ton"],
            "min_purity_required": listing["purity_percentage"],
            "status": "pending"
        }

        return self.repo.create_request(request_payload)

    def update_request(self, clerk_user_id: str, request_id: str, update_data: dict):
        user_id = self._get_internal_user_id(clerk_user_id)
        request = self.get_request_by_id(request_id)
        if request["buyer_id"] != user_id:
            raise Exception("Not authorized to update this requirement")
            
        return self.repo.update_request(request_id, update_data)

    def delete_request(self, clerk_user_id: str, request_id: str):
        user_id = self._get_internal_user_id(clerk_user_id)
        request = self.get_request_by_id(request_id)
        if request["buyer_id"] != user_id:
            raise Exception("Not authorized to delete this requirement")
            
        self.repo.delete_request(request_id)

    def get_supplier_inquiries(self, clerk_user_id: str):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if user["role"] != "supplier":
            raise PermissionError("Only suppliers can access inquiries")
        return self.repo.get_supplier_inquiries(user["id"])

    def accept_inquiry(self, clerk_user_id: str, request_id: str):
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        
        # Fetch the inquiry
        inquiry = self.repo.get_request_by_id(request_id)
        if not inquiry:
            raise ValueError("Inquiry not found")
            
        if not inquiry.get("listing_id"):
            raise ValueError("This is a general demand requirement, not a direct inquiry")
            
        if inquiry.get("status") in ["Accepted", "cancelled"]:
            raise ValueError(f"Cannot accept an inquiry that is already {inquiry.get('status')}")
            
        # Verify supplier owns the listing
        listing = self.repo.get_listing_by_id(inquiry["listing_id"])
        if not listing:
            raise ValueError("Target listing no longer exists")
        if listing["supplier_id"] != user["id"]:
            raise PermissionError("You do not own the target listing for this inquiry")
            
        # Create Order from Inquiry
        from app.services.order_service import OrderService
        order_svc = OrderService()
        
        volume = inquiry.get("volume_needed", 0)
        price_per_ton = inquiry.get("target_price", listing.get("price_per_ton", 0))
        
        safe_order = {
            "buyer_id": inquiry["buyer_id"],
            "supplier_id": user["id"],
            "listing_id": listing["id"],
            "volume": volume,
            "total_value": float(volume) * float(price_per_ton),
            "transport_mode": inquiry.get("delivery_method") or listing.get("transport_modes", ["Road"])[0],
            "status": "confirmed"
        }
        
        order = order_svc.repo.create_order(safe_order)
        
        # Create Contract from Order
        from app.services.contract_service import ContractService
        from app.schemas.contract import ContractCreate
        contract_svc = ContractService()
        
        contract = contract_svc.create_contract(user["id"], ContractCreate(order_id=order["id"]))
        
        # Mark inquiry as Accepted
        self.repo.update_request(request_id, {"status": "Accepted"})
        
        return contract
