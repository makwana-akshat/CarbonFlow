from app.core.config import settings
from supabase import create_client, Client
from app.repositories.user_repository import UserRepository

class ContractService:
    def __init__(self):
        self.db: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
        self.user_repo = UserRepository()

    def get_all_contracts(self, clerk_user_id: str):
        # We fetch audit_contracts for the user
        user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
        if not user:
            return []

        # For MVP we will just return all for demo purposes
        res = self.db.table("audit_contracts").select("*").execute()
        contracts = res.data

        # We will attach timeline and versions
        timeline_res = self.db.table("contract_timeline_events").select("*").execute()
        versions_res = self.db.table("contract_versions").select("*").execute()

        for c in contracts:
            c['timeline'] = [t for t in timeline_res.data if t['contract_id'] == c['id']]
            c['version_history'] = [v for v in versions_res.data if v['contract_id'] == c['id']]

        return contracts

    def get_compliance_summary(self):
        return {
            "active_contracts": 4,
            "pending_approval": 2,
            "completed": 12,
            "with_amendments": 1
        }
