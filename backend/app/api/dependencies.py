from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_clerk_token

security = HTTPBearer()

def get_current_user_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    return verify_clerk_token(token)

def get_current_user_id(token_data: dict = Depends(get_current_user_token)) -> str:
    user_id = token_data.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: missing subject"
        )
    return user_id

def get_current_user(clerk_user_id: str = Depends(get_current_user_id)) -> dict:
    from app.services.user_service import UserService
    service = UserService()
    user = service.get_user(clerk_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found in DB")
    return user

def require_role(required_role: str):
    def role_checker(user: dict = Depends(get_current_user)) -> dict:
        if user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role: {required_role}"
            )
        return user
    return role_checker
