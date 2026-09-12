from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    image_url: Optional[str] = None
    organisation: Optional[str] = None

class UserCreate(UserBase):
    clerk_user_id: str
    role: str = "buyer"

class UserUpdate(UserBase):
    pass

class UserResponse(UserBase):
    id: uuid.UUID
    clerk_user_id: str
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
