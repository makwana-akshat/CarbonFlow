from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.marketplace_service import MarketplaceService
from app.schemas.marketplace import CO2ListingCreate, CO2RequestCreate

router = APIRouter()
marketplace_service = MarketplaceService()

@router.get("/listings", response_model=List[dict])
def get_listings():
    """Returns all active CO2 listings with supplier info."""
    try:
        return marketplace_service.get_active_listings()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/listings", response_model=dict)
def create_listing(listing: CO2ListingCreate, clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return marketplace_service.create_listing(clerk_user_id, listing.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/requirements", response_model=List[dict])
def get_all_requirements():
    """Returns all active requirements from all buyers."""
    try:
        return marketplace_service.get_active_requests()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/requirements/me", response_model=List[dict])
def get_my_requirements(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns active requirements only for the current user."""
    try:
        return marketplace_service.get_my_requests(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/requirements", response_model=dict)
def create_requirement(request: CO2RequestCreate, clerk_user_id: str = Depends(get_current_user_id)):
    try:
        return marketplace_service.create_request(clerk_user_id, request.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
