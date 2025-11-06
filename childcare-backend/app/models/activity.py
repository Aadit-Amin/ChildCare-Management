# app/models/activity.py
from sqlalchemy import Column, Integer, String, Text, Date, Time, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    scheduled_date = Column(Date)
    start_time = Column(Time)
    end_time = Column(Time)
    assigned_staff_id = Column(Integer, ForeignKey("staff.id", ondelete="SET NULL"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assigned_staff = relationship("Staff", back_populates="activities")
