from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository

class RecommendationService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()

    def get_recommendations_for_user(self, clerk_user_id: str, role: str):
        # We fetch recommendations from the DB. 
        # In a real system, a background job or matching engine would populate this.
        # For now, we will just fetch the rows based on the user's role.
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            return []

        # If we have actual matches generated, we'd filter by user_id.
        # But for MVP, let's fetch any recommendations that match the requested role.
        res = self.db.table("recommendations").select("*").eq("user_role", role).order("match_score", desc=True).execute()
        return res.data
