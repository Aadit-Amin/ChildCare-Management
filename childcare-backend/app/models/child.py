# app/models/child.py
from sqlalchemy import Column, Integer, String, Date, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Child(Base):
    __tablename__ = "children"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    dob = Column(Date)
    gender = Column(String(20))
    parent_name = Column(String(255))
    parent_contact = Column(String(100))
    address = Column(Text)
    allergies = Column(Text)
    medical_info = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    attendance_records = relationship(
        "Attendance",
        back_populates="child",
        cascade="all, delete-orphan",
        lazy="joined"
    )

    health_records = relationship(
        "HealthRecord",
        back_populates="child",
        cascade="all, delete-orphan",
        lazy="joined"
    )

    billings = relationship(
        "Billing",
        back_populates="child",
        cascade="all, delete-orphan",
        lazy="joined"
    )
