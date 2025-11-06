# app/schemas/activity_schema.py
from pydantic import BaseModel
from datetime import date, time, datetime
from typing import Optional

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    assigned_staff_id: Optional[int] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    scheduled_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    assigned_staff_id: Optional[int] = None

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
