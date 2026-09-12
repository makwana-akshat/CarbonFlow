from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.recommendation_service import RecommendationService
from app.schemas.recommendations import RecommendationResponse

router = APIRouter()
recommendation_service = RecommendationService()

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(
    role: str = Query(..., description="Role to fetch recommendations for (buyer or supplier)"),
    clerk_user_id: str = Depends(get_current_user_id)
):
    """Returns AI recommendations/matches for the current user."""
    try:
        return recommendation_service.get_recommendations_for_user(clerk_user_id, role)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
