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
