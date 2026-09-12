from pydantic import BaseModel
from typing import List

class RouteOption(BaseModel):
    id: str
    name: str
    modeId: str
    modeName: str
    distanceKm: float
    durationHrs: float
    costInr: float
    carbonEmissionsKg: float
    isRecommended: bool
    riskLevel: str
    steps: List[str]

class LogisticsResponse(BaseModel):
    options: List[RouteOption]
