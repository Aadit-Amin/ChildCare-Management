# app/schemas/child_schema.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from app.schemas.health_record_schema import HealthRecordResponse
from app.schemas.attendance_schema import AttendanceResponse
from app.schemas.billing_schema import BillingResponse

class ChildBase(BaseModel):
    name: str
    dob: Optional[date] = None
    gender: Optional[str] = None
    parent_name: Optional[str] = None
    parent_contact: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None
    medical_info: Optional[str] = None

class ChildCreate(ChildBase):
    pass

class ChildUpdate(BaseModel):
    name: Optional[str] = None
    dob: Optional[date] = None
    gender: Optional[str] = None
    parent_name: Optional[str] = None
    parent_contact: Optional[str] = None
    address: Optional[str] = None
    allergies: Optional[str] = None
    medical_info: Optional[str] = None

class ChildResponse(ChildBase):
    id: int
    created_at: datetime
    health_records: List[HealthRecordResponse] = []
    attendance_records: List[AttendanceResponse] = []
    billings: List[BillingResponse] = []

    class Config:
        from_attributes = True  # (Pydantic v2)
