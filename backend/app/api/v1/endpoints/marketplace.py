from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.api.dependencies import get_current_user_id, require_role, get_current_user
from app.services.marketplace_service import MarketplaceService
from app.schemas.marketplace import CO2ListingCreate, CO2ListingUpdate, CO2RequestCreate, CO2RequestUpdate

router = APIRouter()
marketplace_service = MarketplaceService()

@router.get("/listings")
def get_listings(
    min_purity: Optional[float] = Query(None, description="Minimum purity percentage"),
    max_price: Optional[float] = Query(None, description="Maximum price per ton"),
    min_quantity: Optional[float] = Query(None, description="Minimum available quantity"),
    max_quantity: Optional[float] = Query(None, description="Maximum available quantity"),
    search_query: Optional[str] = Query(None, description="Search term for facility name"),
    verified_only: Optional[bool] = Query(None, description="Only verified listings"),
    sort_by: Optional[str] = Query(None, description="Sort order"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Returns paginated active CO2 listings with optional filters."""
    try:
        return marketplace_service.get_active_listings(
            min_purity=min_purity,
            max_price=max_price,
            min_quantity=min_quantity,
            max_quantity=max_quantity,
            search_query=search_query,
            verified_only=verified_only,
            sort_by=sort_by,
            page=page,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/listings/{id}")
def get_listing(id: str):
    """Get a single active listing by ID."""
    try:
        listing = marketplace_service.get_listing_by_id(id)
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        # Usually public users should only see active ones. We can enforce it here if needed.
        if listing.get("status") != "active":
            raise HTTPException(status_code=404, detail="Listing is inactive")
        return listing
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/listings", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_listing(
    listing: CO2ListingCreate, 
    user: dict = Depends(require_role("supplier"))
):
    try:
        return marketplace_service.create_listing(user["clerk_user_id"], listing.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/listings/{id}")
def update_listing(
    id: str,
    listing_update: CO2ListingUpdate,
    user: dict = Depends(require_role("supplier"))
):
    """Supplier updates their own listing."""
    try:
        updated = marketplace_service.update_listing(
            user["clerk_user_id"], 
            id, 
            listing_update.model_dump(exclude_unset=True)
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Listing not found")
        return updated
    except Exception as e:
        if "Not authorized" in str(e):
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/listings/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    id: str,
    user: dict = Depends(require_role("supplier"))
):
    """Supplier deactivates their own listing."""
    try:
        marketplace_service.delete_listing(user["clerk_user_id"], id)
    except Exception as e:
        if "Not authorized" in str(e):
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/requirements", response_model=dict)
def get_all_requirements(
    min_purity: Optional[float] = Query(None, description="Minimum purity required"),
    max_price: Optional[float] = Query(None, description="Maximum target price per ton"),
    min_quantity: Optional[float] = Query(None, description="Minimum volume needed"),
    max_quantity: Optional[float] = Query(None, description="Maximum volume needed"),
    search_query: Optional[str] = Query(None, description="Search term for application or title"),
    sort_by: Optional[str] = Query(None, description="Sort order"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    """Returns paginated active requirements from all buyers with optional filters."""
    try:
        # Note: the marketplace_service.get_active_requests does not exist in standard form, but the repository does.
        # Let's assume marketplace_service.get_active_requests just forwards to repo.
        return marketplace_service.get_active_requests(
            min_purity=min_purity,
            max_price=max_price,
            min_quantity=min_quantity,
            max_quantity=max_quantity,
            search_query=search_query,
            sort_by=sort_by,
            page=page,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/requirements/me", response_model=List[dict])
def get_my_requirements(user: dict = Depends(require_role("buyer"))):
    """Returns all requirements only for the current buyer."""
    try:
        return marketplace_service.get_my_requests(user["clerk_user_id"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/requirements/{id}")
def get_requirement(id: str):
    """Get a single requirement by ID."""
    try:
        req = marketplace_service.get_request_by_id(id)
        if not req:
            raise HTTPException(status_code=404, detail="Requirement not found")
        if req.get("status") == "cancelled":
            raise HTTPException(status_code=404, detail="Requirement is cancelled")
        return req
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/requirements", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_requirement(request: CO2RequestCreate, user: dict = Depends(require_role("buyer"))):
    """Buyer creates a new requirement."""
    try:
        return marketplace_service.create_request(user["clerk_user_id"], request.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/requirements/{id}")
def update_requirement(
    id: str,
    request_update: CO2RequestUpdate,
    user: dict = Depends(require_role("buyer"))
):
    """Buyer updates their own requirement."""
    try:
        updated = marketplace_service.update_request(
            user["clerk_user_id"], 
            id, 
            request_update.model_dump(exclude_unset=True)
        )
        if not updated:
            raise HTTPException(status_code=404, detail="Requirement not found")
        return updated
    except Exception as e:
        if "Not authorized" in str(e):
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/requirements/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_requirement(
    id: str,
    user: dict = Depends(require_role("buyer"))
):
    """Buyer soft-deletes (cancels) their own requirement."""
    try:
        marketplace_service.delete_request(user["clerk_user_id"], id)
    except Exception as e:
        if "Not authorized" in str(e):
            raise HTTPException(status_code=403, detail=str(e))
        raise HTTPException(status_code=500, detail=str(e))
