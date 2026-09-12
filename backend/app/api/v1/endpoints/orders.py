from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from app.api.dependencies import get_current_user_id
from app.services.order_service import OrderService
from app.schemas.order import OrderCreate, OrderResponse, OrderUpdateStatus

router = APIRouter()
order_service = OrderService()

@router.get("/", response_model=dict)
def get_orders(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    clerk_user_id: str = Depends(get_current_user_id)
):
    """Returns paginated orders for the current user."""
    try:
        return order_service.get_orders(clerk_user_id, status=status, page=page, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=dict)
def get_active_orders(clerk_user_id: str = Depends(get_current_user_id)):
    """Legacy endpoint returning paginated active orders."""
    try:
        return order_service.get_orders(clerk_user_id, status=None, page=1, limit=50)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, clerk_user_id: str = Depends(get_current_user_id)):
    """Creates a new order (offtake agreement)."""
    try:
        return order_service.create_order(clerk_user_id, order.model_dump())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: str, clerk_user_id: str = Depends(get_current_user_id)):
    """Gets a specific order by ID."""
    try:
        return order_service.get_order_by_id(clerk_user_id, order_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
        
@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: str, update: OrderUpdateStatus, clerk_user_id: str = Depends(get_current_user_id)):
    """Updates the status of an order."""
    try:
        return order_service.update_order_status(clerk_user_id, order_id, update.status)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{order_id}")
def delete_order(order_id: str, clerk_user_id: str = Depends(get_current_user_id)):
    """Cancels an order."""
    try:
        order_service.delete_order(clerk_user_id, order_id)
        return {"detail": "Order cancelled"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
