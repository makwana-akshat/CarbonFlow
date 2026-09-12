from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.impact_service import ImpactService
from app.schemas.impact import (
    ImpactOverviewMetric,
    JourneyStage,
    PlatformSummaryStats,
    MonthlyUtilizationData,
    ApplicationShare,
    RegionalImpactItem,
    ContributorItem,
    RecentActivityItem
)

router = APIRouter()

@router.get("/overview", response_model=List[ImpactOverviewMetric])
def get_overview(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_overview()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/journey", response_model=List[JourneyStage])
def get_journey(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_journey()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/platform-summary", response_model=PlatformSummaryStats)
def get_platform_summary(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_platform_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/monthly-utilization", response_model=List[MonthlyUtilizationData])
def get_monthly_utilization(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_monthly_utilization()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/applications", response_model=List[ApplicationShare])
def get_applications(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_applications()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/regional", response_model=List[RegionalImpactItem])
def get_regional(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_regional()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/contributors", response_model=List[ContributorItem])
def get_contributors(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_contributors()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/recent-activity", response_model=List[RecentActivityItem])
def get_recent_activity(user_id: str = Depends(get_current_user_id)):
    service = ImpactService()
    try:
        return service.get_recent_activity()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
