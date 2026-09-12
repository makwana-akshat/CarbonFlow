from app.ai.provider import LLMProvider
from app.ai.prompts import CARBONFLOW_CHATBOT_SYSTEM_PROMPT_V1
from pydantic import BaseModel
import json
from app.services.dashboard_service import DashboardService
from app.repositories.user_repository import UserRepository

class ChatIntentResponse(BaseModel):
    intent: str
    reply: str

class AIService:
    def __init__(self):
        self.dashboard_service = DashboardService()
        self.user_repo = UserRepository()

    def process_chat(self, clerk_user_id: str, message: str) -> str:
        user = self.user_repo.get_by_clerk_id(clerk_user_id)
        if not user:
            raise Exception("User not found")
            
        role = user["role"]
        company_name = user["company_name"]
        
        try:
            llm = LLMProvider()
            if not llm.is_available():
                return "The CarbonFlow AI is currently offline. Please contact an administrator."
                
            # First layer: intent detection via structured response (optional but good for this phase MVP)
            # Actually, to make it faster and simpler without function calling, we'll just gather the basic KPI/Alerts data context
            # and inject it so the LLM always has the basic situation awareness of the user.
            
            kpis = self.dashboard_service.get_kpis(clerk_user_id)
            alerts = self.dashboard_service.get_alerts(clerk_user_id)
            
            context = f"User Company: {company_name}\nRole: {role}\n\nRecent KPIs: {json.dumps(kpis)}\n\nRecent Alerts/Orders: {json.dumps(alerts)}"
            
            system_prompt_with_context = f"{CARBONFLOW_CHATBOT_SYSTEM_PROMPT_V1}\n\n[CONTEXT DATA]\n{context}\n[/CONTEXT DATA]"
            
            # Simple text generation
            response = llm.generate(
                system_prompt=system_prompt_with_context,
                user_prompt=message,
                max_tokens=800
            )
            
            return response
            
        except Exception as e:
            return f"I'm sorry, I'm having trouble processing that right now. {str(e)}"
