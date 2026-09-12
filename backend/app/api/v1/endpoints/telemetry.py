from fastapi import APIRouter, Depends, HTTPException, Body
from typing import List, Dict, Any
from app.api.dependencies import get_current_user_id
from app.services.monitoring_service import MonitoringService
from app.schemas.telemetry import AlertResponse, FacilityMonitoringResponse, ShipmentMonitoringResponse, OperationalSummary

router = APIRouter()
monitoring_service = MonitoringService()

@router.get("/alerts", response_model=List[AlertResponse])
def get_alerts(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns active SCADA and telemetry alerts."""
    try:
        return monitoring_service.get_active_alerts(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts/history", response_model=List[AlertResponse])
def get_alert_history(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return monitoring_service.get_alert_history()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts/summary", response_model=OperationalSummary)
def get_alert_summary(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return monitoring_service.get_alert_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str, clerk_user_id: str = Depends(get_current_user_id)):
    try:
        monitoring_service.acknowledge_alert(alert_id)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/alerts/{alert_id}/resolve")
def resolve_alert(
    alert_id: str, 
    resolution_note: str = Body(..., embed=True),
    clerk_user_id: str = Depends(get_current_user_id)
):
    try:
        monitoring_service.resolve_alert(alert_id, resolved_by=clerk_user_id, resolution_note=resolution_note)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/facilities/monitoring", response_model=List[FacilityMonitoringResponse])
def get_facilities_monitoring(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return monitoring_service.get_facilities_monitoring()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/shipments/monitoring", response_model=List[ShipmentMonitoringResponse])
def get_shipments_monitoring(clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return monitoring_service.get_shipments_monitoring()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
