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
