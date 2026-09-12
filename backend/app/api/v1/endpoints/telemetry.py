from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.telemetry_service import TelemetryService

router = APIRouter()
telemetry_service = TelemetryService()

@router.get("/alerts", response_model=List[dict])
def get_alerts(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns active SCADA and telemetry alerts."""
    try:
        return telemetry_service.get_active_alerts(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
