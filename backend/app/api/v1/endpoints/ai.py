from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user_id
from app.schemas.ai import ChatRequest, ChatResponse
from app.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/chat", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest, clerk_user_id: str = Depends(get_current_user_id)):
    try:
        reply = ai_service.process_chat(clerk_user_id, request.message)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
