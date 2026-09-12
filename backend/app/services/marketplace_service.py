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

    def get_active_listings(self):
        return self.repo.get_active_listings()

    def create_listing(self, clerk_user_id: str, listing_data: dict):
        user_id = self._get_internal_user_id(clerk_user_id)
        listing_data["supplier_id"] = user_id
        return self.repo.create_listing(listing_data)

    def get_active_requests(self):
        return self.repo.get_active_requests()
    
    def get_my_requests(self, clerk_user_id: str):
        user_id = self._get_internal_user_id(clerk_user_id)
        return self.repo.get_requests_by_buyer(user_id)

    def create_request(self, clerk_user_id: str, request_data: dict):
        user_id = self._get_internal_user_id(clerk_user_id)
        request_data["buyer_id"] = user_id
        return self.repo.create_request(request_data)
