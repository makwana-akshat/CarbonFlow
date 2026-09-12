from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user_id
from app.services.impact_service import ImpactService

router = APIRouter()
impact_service = ImpactService()

@router.get("/metrics", response_model=dict)
def get_impact_metrics(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns ESG and carbon abatement metrics."""
    try:
        return impact_service.get_impact_metrics(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
