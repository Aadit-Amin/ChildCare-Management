# app/schemas/staff_schema.py
from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.schemas.user_schema import UserResponse


class StaffBase(BaseModel):
    user_id: int
    contact: Optional[str] = None
    position: Optional[str] = None
    assigned_room: Optional[str] = None
    hire_date: Optional[date] = None


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    contact: Optional[str] = None
    position: Optional[str] = None
    assigned_room: Optional[str] = None
    hire_date: Optional[date] = None


class StaffResponse(StaffBase):
    id: int
    user: Optional[UserResponse] = None  # include related user data

    class Config:
        from_attributes = True  # modern replacement for orm_mode
