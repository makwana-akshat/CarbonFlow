from app.ai.orchestrator import AgentOrchestrator
from app.repositories.user_repository import UserRepository
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.user_repo = UserRepository()

    def process_chat(self, clerk_user_id: str, message: str):
        try:
            user = self.user_repo.get_user_by_clerk_id(clerk_user_id)
            if not user:
                raise Exception("User not found")
            
            # Use clerk_user_id as the session_id for simplicity (1 active session per user)
            orchestrator = AgentOrchestrator(clerk_user_id=clerk_user_id, session_id=clerk_user_id)
            result = orchestrator.process_message(message)
            
            return {
                "reply": result.message,
                "intent": result.intent,
                "dashboard_action": result.dashboard_action.model_dump() if result.dashboard_action else None,
                "requires_confirmation": result.requires_confirmation
            }
        except Exception as e:
            logger.error(f"AIService error: {str(e)}")
            return {
                "reply": f"I'm sorry, I encountered an error: {str(e)}",
                "intent": "ERROR",
                "dashboard_action": None,
                "requires_confirmation": False
            }
