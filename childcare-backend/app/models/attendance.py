# app/models/attendance.py
from sqlalchemy import Column, Integer, ForeignKey, Date, Time, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, nullable=False)
    check_in = Column(Time)
    check_out = Column(Time)
    status = Column(String(32), default="Present")
    created_at = Column(DateTime, default=datetime.utcnow)

    child = relationship("Child", back_populates="attendance_records")
