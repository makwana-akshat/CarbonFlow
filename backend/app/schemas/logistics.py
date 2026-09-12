from pydantic import BaseModel
from typing import List

class RouteOption(BaseModel):
    id: str
    name: str
    modeId: str
    modeName: str
    distance_km: float
    travel_time_hrs: float
    estimated_cost_inr: float
    emissions_tco2e: float
    volume_tonnes: float
    reliability_score: float
    isRecommended: bool
    riskLevel: str
    steps: List[str]

class LogisticsResponse(BaseModel):
    options: List[RouteOption]
