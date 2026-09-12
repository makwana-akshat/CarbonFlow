from app.repositories.user_repository import UserRepository

class UserService:
    def __init__(self):
        self.user_repo = UserRepository()

    def get_user(self, clerk_user_id: str) -> dict:
        return self.user_repo.get_user_by_clerk_id(clerk_user_id)

    def sync_user(self, clerk_user_id: str, email: str, first_name: str, last_name: str, image_url: str) -> dict:
        user_data = {
            "clerk_user_id": clerk_user_id,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "image_url": image_url
        }
        return self.user_repo.upsert_user(user_data)

    def update_user(
        self,
        clerk_user_id: str,
        first_name: str = None,
        last_name: str = None,
        phone: str = None,
        job_title: str = None,
        company_name: str = None,
        industry: str = None,
        co2_capacity: str = None,
        facility_location: str = None,
        is_verified: bool = None,
        notif_price_alerts: bool = None,
        notif_supply_alerts: bool = None,
        notif_order_updates: bool = None,
        notif_contract_notifs: bool = None,
        role: str = None
    ) -> dict:
        update_data = {}
        if first_name is not None: update_data["first_name"] = first_name
        if last_name is not None: update_data["last_name"] = last_name
        if phone is not None: update_data["phone"] = phone
        if job_title is not None: update_data["job_title"] = job_title
        if company_name is not None: update_data["company_name"] = company_name
        if industry is not None: update_data["industry"] = industry
        if co2_capacity is not None: update_data["co2_capacity"] = co2_capacity
        if facility_location is not None: update_data["facility_location"] = facility_location
        if is_verified is not None: update_data["is_verified"] = is_verified
        if notif_price_alerts is not None: update_data["notif_price_alerts"] = notif_price_alerts
        if notif_supply_alerts is not None: update_data["notif_supply_alerts"] = notif_supply_alerts
        if notif_order_updates is not None: update_data["notif_order_updates"] = notif_order_updates
        if notif_contract_notifs is not None: update_data["notif_contract_notifs"] = notif_contract_notifs
        if role is not None: update_data["role"] = role
        
        if not update_data:
            return self.get_user(clerk_user_id)
            
        return self.user_repo.update_user(clerk_user_id, update_data)
