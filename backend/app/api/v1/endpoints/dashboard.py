from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user_id
from app.services.dashboard_service import DashboardService

router = APIRouter()
dashboard_service = DashboardService()

@router.get("/summary", response_model=dict)
def get_dashboard_summary(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns dynamic KPI and market data for the dashboard."""
    try:
        return dashboard_service.get_summary(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
