from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ImpactOverviewMetric(BaseModel):
    id: str
    label: str
    tonnes: int
    formattedTonnes: str
    unit: str
    trendText: str
    trendPositive: bool
    subtext: str

class JourneyStageDetail(BaseModel):
    activeTransactions: int
    avgPurity: str
    avgDistanceKm: int
    completed: int
    pending: int
    activeFacilities: int
    description: str
    custodyCompliance: str

class JourneyStage(BaseModel):
    id: str
    order: int
    name: str
    tonnes: int
    formattedTonnes: str
    conversionPercent: Optional[int] = None
    headlineStats: str
    tagline: str
    details: JourneyStageDetail

class PlatformSummaryStats(BaseModel):
    totalUtilizedTonnes: int
    formattedUtilizedTonnes: str
    utilizationRatePercent: float
    completedTransactions: int
    activeFacilities: int
    connectedRegions: int
    verifiedClearingVolumeTonnes: int

class MonthlyUtilizationData(BaseModel):
    month: str
    periodLabel: str
    tonnes: int
    displayValue: str
    targetTonnes: int

class ApplicationShare(BaseModel):
    id: str
    application: str
    tonnes: int
    formattedTonnes: str
    percentage: float
    primaryBuyers: str
    colorVar: str

class Coordinates(BaseModel):
    lat: float
    lng: float

class RegionalImpactItem(BaseModel):
    id: str
    name: str
    state: str
    tonnesUtilized: int
    formattedTonnes: str
    activeFacilities: int
    completedTransactions: int
    primaryApplication: str
    transportNetwork: str
    coordinates: Coordinates

class ContributorItem(BaseModel):
    id: str
    name: str
    roleType: str
    utilizedTonnes: int
    formattedTonnes: str
    transactionsCount: int
    location: str
    activeSince: str

class RecentActivityItem(BaseModel):
    id: str
    source: str
    destination: str
    volumeTonnes: int
    formattedVolume: str
    region: str
    mode: str
    status: str
    completedTime: str
