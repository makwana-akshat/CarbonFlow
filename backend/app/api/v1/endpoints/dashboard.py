from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies import get_current_user_id
from app.services.dashboard_service import DashboardService

router = APIRouter()
dashboard_service = DashboardService()

@router.get("/kpis", response_model=dict)
def get_dashboard_kpis(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return dashboard_service.get_kpis(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-prices", response_model=dict)
def get_dashboard_market_prices(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return dashboard_service.get_market_prices(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/supply-demand", response_model=dict)
def get_dashboard_supply_demand(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return dashboard_service.get_supply_demand(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts", response_model=dict)
def get_dashboard_alerts(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return dashboard_service.get_alerts(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ai-insight", response_model=dict)
def get_dashboard_ai_insight(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return dashboard_service.get_ai_insight(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
