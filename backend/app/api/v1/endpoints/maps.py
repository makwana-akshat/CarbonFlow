from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.map_service import MapService
from app.schemas.maps import SupplierNode, BuyerNode, FacilityNode, RouteData, CarbonFlowEdge

router = APIRouter()
map_service = MapService()

@router.get("/suppliers", response_model=List[SupplierNode])
def get_suppliers(clerk_user_id: str = Depends(get_current_user_id)):
    return map_service.get_suppliers()

@router.get("/buyers", response_model=List[BuyerNode])
def get_buyers(clerk_user_id: str = Depends(get_current_user_id)):
    return map_service.get_buyers()

@router.get("/facilities", response_model=List[FacilityNode])
def get_facilities(clerk_user_id: str = Depends(get_current_user_id)):
    return map_service.get_facilities()

@router.get("/routes", response_model=List[RouteData])
def get_routes(clerk_user_id: str = Depends(get_current_user_id)):
    return map_service.get_routes()

@router.get("/carbon-flows", response_model=List[CarbonFlowEdge])
def get_carbon_flows(clerk_user_id: str = Depends(get_current_user_id)):
    return map_service.get_carbon_flows()
