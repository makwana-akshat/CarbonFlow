from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from decimal import Decimal
import uuid
from datetime import datetime

class RouteStep(BaseModel):
    icon_type: str
    label: str

class MatchScoreBreakdown(BaseModel):
    purity: int
    price: int
    distance: int
    reliability: int
    segmentFit: int

class RecommendationResponse(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    user_role: str
    listing_id: Optional[uuid.UUID] = None
    requirement_id: Optional[uuid.UUID] = None
    company_name: str
    facility_type: Optional[str] = None
    location: Optional[str] = None
    match_score: Decimal
    is_best_match: bool = False
    is_verified: bool = False
    tags: List[str] = []
    co2_grade: Optional[str] = None
    volume: Optional[str] = None
    price_per_ton: Optional[str] = None
    co2_source: Optional[str] = None
    transport_mode: Optional[str] = None
    purity: Optional[str] = None
    delivery_timeline: Optional[str] = None
    certification: Optional[str] = None
    distance: Optional[str] = None
    reliability: Optional[str] = None
    segment: Optional[str] = None
    reasons: Optional[List[str]] = None
    breakdown: Optional[MatchScoreBreakdown] = None
    route_steps: Optional[List[RouteStep]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
