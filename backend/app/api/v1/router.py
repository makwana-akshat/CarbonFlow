from fastapi import APIRouter
from app.api.v1.endpoints import users, marketplace, orders, dashboard, telemetry, impact, recommendations, contracts, maps, logistics

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
api_router.include_router(impact.router, prefix="/impact", tags=["impact"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
api_router.include_router(maps.router, prefix="/maps", tags=["maps"])
api_router.include_router(logistics.router, prefix="/logistics", tags=["logistics"])

