from supabase import create_client, Client
from app.core.config import settings
from typing import Optional

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise Exception("Supabase credentials not configured")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

class UserRepository:
    @property
    def db(self) -> Client:
        return get_supabase_client()

    def get_user_by_clerk_id(self, clerk_user_id: str) -> Optional[dict]:
        response = self.db.table("users").select("*").eq("clerk_user_id", clerk_user_id).execute()
        data = response.data
        return data[0] if data else None

    def upsert_user(self, user_data: dict) -> dict:
        response = self.db.table("users").upsert(
            user_data, on_conflict="clerk_user_id"
        ).execute()
        return response.data[0]
