# app/schemas/billing_schema.py
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from decimal import Decimal

class BillingBase(BaseModel):
    child_id: int
    amount: Decimal
    status: Optional[str] = "Unpaid"
    issued_date: Optional[date] = None
    due_date: Optional[date] = None
    notes: Optional[str] = None

class BillingCreate(BillingBase):
    pass

class BillingUpdate(BaseModel):
    amount: Optional[Decimal] = None
    status: Optional[str] = None
    issued_date: Optional[date] = None
    due_date: Optional[date] = None
    notes: Optional[str] = None

class BillingResponse(BillingBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
