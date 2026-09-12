from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository

class ImpactService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()

    def get_impact_metrics(self, clerk_user_id: str):
        # We'd calculate based on `orders` and `co2_listings`.
        # Return hardcoded realistic metrics based on the frontend's needs.
        
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        role = user["role"] if user else "buyer"

        return {
            "total_abated": "14,250 t",
            "active_projects": 4,
            "esg_score": 92,
            "certifications": ["ISO-14064", "Verra Verified"],
            "recent_milestones": [
                {"date": "2026-08-12", "title": "Reached 10,000 t abatement"},
                {"date": "2026-09-01", "title": "Passed Q3 Environmental Audit"}
            ],
            "chart_data": [
                {"month": "Jan", "abated": 1200},
                {"month": "Feb", "abated": 1350},
                {"month": "Mar", "abated": 1100},
                {"month": "Apr", "abated": 1500},
                {"month": "May", "abated": 1600},
                {"month": "Jun", "abated": 1750}
            ]
        }
