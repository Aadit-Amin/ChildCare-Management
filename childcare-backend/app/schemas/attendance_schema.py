from pydantic import BaseModel, field_validator
from datetime import date, time, datetime
from typing import Optional, Union


class AttendanceBase(BaseModel):
    child_id: int
    date: date
    check_in: Optional[time] = None
    check_out: Optional[time] = None
    status: str = "Present"


class AttendanceCreate(AttendanceBase):
    pass


# ✅ FIXED AttendanceUpdate - accepts both string & date/time
class AttendanceUpdate(BaseModel):
    child_id: Optional[int] = None
    date: Optional[Union[str]] = None
    check_in: Optional[Union[str, time]] = None
    check_out: Optional[Union[str, time]] = None
    status: Optional[str] = None

    @field_validator("date", mode="plain")
    def parse_date(cls, v):
        if v in (None, "", "null"):
            return None
        if isinstance(v, date):
            return v
        try:
            return date.fromisoformat(v)
        except Exception:
            raise ValueError("Date must be in YYYY-MM-DD format")

    @field_validator("check_in", "check_out", mode="before")
    def parse_time(cls, v):
        if v in (None, "", "null"):
            return None
        if isinstance(v, time):
            return v
        try:
            return time.fromisoformat(v)
        except Exception:
            raise ValueError("Time must be in HH:MM format")


class AttendanceResponse(BaseModel):
    id: int
    child_id: int
    date: date
    check_in: Optional[time]
    check_out: Optional[time]
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
