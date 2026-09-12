from fastapi import APIRouter, Depends
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.logistics_service import LogisticsService
from app.schemas.logistics import LogisticsResponse

router = APIRouter()
logistics_service = LogisticsService()

@router.get("/calculate-route", response_model=LogisticsResponse)
def calculate_route(
    origin: str, 
    destination: str, 
    volume: float, 
    purity: float,
    clerk_user_id: str = Depends(get_current_user_id)
):
    options = logistics_service.calculate_routes(origin, destination, volume, purity)
    return LogisticsResponse(options=options)
