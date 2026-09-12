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

    def get_orders(self, clerk_user_id: str, status: str = None, page: int = 1, limit: int = 20):
        user = self._get_internal_user_id(clerk_user_id)
        return self.repo.get_orders(user["id"], user["role"], status, page, limit)

    def get_order_by_id(self, clerk_user_id: str, order_id: str):
        user = self._get_internal_user_id(clerk_user_id)
        order = self.repo.get_order_by_id(order_id)
        if not order:
            raise Exception("Order not found")
        
        # Verify access
        if user["role"] == "buyer" and order["buyer_id"] != user["id"]:
            raise Exception("Not authorized to view this order")
        if user["role"] == "supplier" and order["supplier_id"] != user["id"]:
            raise Exception("Not authorized to view this order")
            
        return order

    def create_order(self, clerk_user_id: str, order_data: dict):
        user = self._get_internal_user_id(clerk_user_id)
        if user["role"] != "buyer":
            raise Exception("Only buyers can create orders")
            
        # 1. Validate listing exists and is active
        from app.repositories.marketplace_repository import MarketplaceRepository
        market_repo = MarketplaceRepository()
        listing = market_repo.get_listing_by_id(str(order_data["listing_id"]))
        if not listing:
            raise Exception("Listing not found")
        if listing.get("status") != "active":
            raise Exception("Listing is not active")
            
        # 2. Check quantity
        requested_volume = order_data["volume"]
        available = listing.get("volume_tpa", 0)
        if requested_volume <= 0:
            raise Exception("Volume must be greater than 0")
        if requested_volume > available:
            raise Exception(f"Requested volume ({requested_volume}) exceeds available inventory ({available})")
            
        # 3. Calculate total value
        price_per_ton = listing.get("price_per_ton", 0)
        total_value = requested_volume * price_per_ton
        
        # 4. Construct safe order
        safe_order = {
            "buyer_id": user["id"],
            "supplier_id": listing["supplier_id"],
            "listing_id": listing["id"],
            "volume": requested_volume,
            "total_value": total_value,
            "transport_mode": order_data.get("transport_mode", "Road"),
            "status": "pending"
        }
        
        # 5. Create order in DB
        created_order = self.repo.create_order(safe_order)
        
        # 6. Decrement inventory (simulated transaction)
        new_volume = available - requested_volume
        market_repo.update_listing(listing["id"], {"volume_tpa": new_volume})
        
        return created_order
        
    def update_order_status(self, clerk_user_id: str, order_id: str, new_status: str):
        order = self.get_order_by_id(clerk_user_id, order_id)
        user = self._get_internal_user_id(clerk_user_id)
        
        valid_statuses = ["pending", "confirmed", "loading", "in-transit", "delivered", "continuous-flow", "cancelled"]
        if new_status not in valid_statuses:
            raise Exception("Invalid status")
            
        # Basic state machine rules
        if user["role"] == "buyer":
            if new_status != "cancelled":
                raise Exception("Buyers can only cancel pending orders")
            if order["status"] not in ["pending", "confirmed"]:
                raise Exception("Cannot cancel an order that is already in progress")
        
        if user["role"] == "supplier":
            # Just verify they aren't cancelling a delivered order
            if order["status"] == "delivered" and new_status != "delivered":
                raise Exception("Cannot change status of a delivered order")
                
        # If cancelled, restore inventory
        if new_status == "cancelled" and order["status"] != "cancelled":
            from app.repositories.marketplace_repository import MarketplaceRepository
            market_repo = MarketplaceRepository()
            listing = market_repo.get_listing_by_id(order["listing_id"])
            if listing:
                market_repo.update_listing(listing["id"], {"volume_tpa": listing["volume_tpa"] + order["volume"]})
                
        return self.repo.update_order_status(order_id, new_status)

    def delete_order(self, clerk_user_id: str, order_id: str):
        # We treat DELETE as a cancellation to preserve historical transactional data
        return self.update_order_status(clerk_user_id, order_id, "cancelled")
