from app.repositories.order_repository import OrderRepository
from app.repositories.user_repository import UserRepository

class OrderService:
    def __init__(self):
        self.repo = OrderRepository()
        self.user_repo = UserRepository()

    def _get_internal_user_id(self, clerk_user_id: str) -> str:
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found in internal DB")
        return user

    def get_active_orders(self, clerk_user_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        return self.repo.get_active_orders(user["id"], user["role"])

    def create_order(self, clerk_user_id: str, order_data: dict):
        user = self._get_internal_user_id(clerk_user_id)
        order_data["buyer_id"] = user["id"]
        return self.repo.create_order(order_data)
