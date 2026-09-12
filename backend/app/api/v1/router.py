from fastapi import APIRouter
from app.api.v1.endpoints import users

api_router = APIRouter()

@api_router.get("/health")
def health_check():
    return {"status": "healthy"}

api_router.include_router(users.router, prefix="/users", tags=["users"])

