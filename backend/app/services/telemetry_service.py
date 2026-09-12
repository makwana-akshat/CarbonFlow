from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository

class TelemetryService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()

    def get_active_alerts(self, clerk_user_id: str):
        # In a real app we'd filter alerts by facilities owned by the user.
        # For now, we fetch all active alerts.
        response = self.db.table("alerts").select("*, facilities(name, region)").eq("is_resolved", False).order("created_at", desc=True).execute()
        return response.data
