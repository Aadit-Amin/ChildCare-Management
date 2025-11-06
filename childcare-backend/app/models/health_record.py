# app/models/health_record.py
from sqlalchemy import Column, Integer, Text, String, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class HealthRecord(Base):
    __tablename__ = "health_records"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=False)
    doctor_name = Column(String(255))
    record_date = Column(Date, default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    child = relationship("Child", back_populates="health_records")
