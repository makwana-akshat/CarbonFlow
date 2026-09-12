from pydantic import BaseModel, ConfigDict
from typing import List, Optional
import uuid

class GeoPoint(BaseModel):
    lat: float
    lng: float

class SupplierNode(BaseModel):
    id: str
    coords: GeoPoint
    name: str
    location: str
    industry: str
    facilityType: str
    availableTonnes: int
    purity: float
    pricePerTon: float
    verified: bool

    model_config = ConfigDict(from_attributes=True)

class BuyerNode(BaseModel):
    id: str
    coords: GeoPoint
    name: str
    organisation: str
    location: str
    application: str
    minPurity: float
    verified: bool

    model_config = ConfigDict(from_attributes=True)

class FacilityNode(BaseModel):
    id: str
    coords: GeoPoint
    name: str
    type: str
    operator: str
    location: str

    model_config = ConfigDict(from_attributes=True)

class RouteData(BaseModel):
    id: str
    supplierId: str
    buyerId: str
    supplierName: str
    buyerName: str
    geometry: List[GeoPoint]
    distanceKm: float
    travelTimeHrs: float
    estimatedCostINR: float
    transportMode: str
    emissionsTco2e: Optional[float] = None
    reliabilityScore: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)

class CarbonFlowEdge(BaseModel):
    id: str
    fromId: str
    toId: str
    tonnes: int
    active: bool

    model_config = ConfigDict(from_attributes=True)

class RegionSupply(BaseModel):
    totalTonnes: int
    activeSuppliers: int

class RegionDemand(BaseModel):
    totalTonnes: int
    activeBuyers: int

class RegionData(BaseModel):
    id: str
    name: str
    coords: GeoPoint
    avgPrice: float
    supply: RegionSupply
    demand: RegionDemand

    model_config = ConfigDict(from_attributes=True)
