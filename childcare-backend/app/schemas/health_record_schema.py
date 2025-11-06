# app/schemas/health_record_schema.py
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class HealthRecordBase(BaseModel):
    child_id: int
    description: str
    doctor_name: Optional[str] = None
    record_date: Optional[date] = None

class HealthRecordCreate(HealthRecordBase):
    pass

class HealthRecordUpdate(BaseModel):
    description: Optional[str] = None
    doctor_name: Optional[str] = None
    record_date: Optional[date] = None

class HealthRecordResponse(HealthRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
