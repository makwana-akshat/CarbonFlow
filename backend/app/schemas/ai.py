from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    message: str

class DashboardAction(BaseModel):
    type: str
    payload: Dict[str, Any]

class ChatResponse(BaseModel):
    reply: str
    intent: Optional[str] = "UNKNOWN"
    dashboard_action: Optional[DashboardAction] = None
    requires_confirmation: bool = False
