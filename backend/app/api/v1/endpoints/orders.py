from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.dependencies import get_current_user_id
from app.services.order_service import OrderService
from app.schemas.order import OrderCreate

router = APIRouter()
order_service = OrderService()

@router.get("/active", response_model=List[dict])
def get_active_orders(clerk_user_id: str = Depends(get_current_user_id)):
    """Returns active orders for the current user."""
    try:
        return order_service.get_active_orders(clerk_user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
def create_order(order: OrderCreate, clerk_user_id: str = Depends(get_current_user_id)):
    """Creates a new order (offtake agreement)."""
    try:
        return order_service.create_order(clerk_user_id, order.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
