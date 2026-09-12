from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from app.api.dependencies import get_current_user_id
from app.services.user_service import UserService
from app.schemas.user import UserResponse

router = APIRouter()
user_service = UserService()

class SyncUserRequest(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None

class UpdateUserRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    organisation: Optional[str] = None
    role: Optional[str] = None

@router.patch("/me", response_model=UserResponse)
def update_current_user(request: UpdateUserRequest, clerk_user_id: str = Depends(get_current_user_id)):
    """
    Updates the safe profile fields of the current authenticated user.
    """
    try:
        user = user_service.update_user(
            clerk_user_id=clerk_user_id,
            first_name=request.first_name,
            last_name=request.last_name,
            organisation=request.organisation,
            role=request.role
        )
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/sync", response_model=UserResponse)
def sync_user(request: SyncUserRequest, clerk_user_id: str = Depends(get_current_user_id)):
    """
    Synchronizes a Clerk user to the Supabase database.
    """
    try:
        user = user_service.sync_user(
            clerk_user_id=clerk_user_id,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            image_url=request.image_url
        )
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to sync user: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
def get_current_user(clerk_user_id: str = Depends(get_current_user_id)):
    """
    Returns the current authenticated user's profile from Supabase.
    """
    try:
        user = user_service.get_user(clerk_user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found in database"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
