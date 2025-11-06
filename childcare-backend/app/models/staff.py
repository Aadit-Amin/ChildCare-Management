# app/models/staff.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import date

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    contact = Column(String(50), nullable=True)
    position = Column(String(100), nullable=True)
    assigned_room = Column(String(100), nullable=True)
    hire_date = Column(Date, default=date.today)

    # Relationship to User
    user = relationship("User", back_populates="staff_profile")

    # Relationship to activities
    activities = relationship(
        "Activity",
        back_populates="assigned_staff",
        cascade="all, delete-orphan"
    )
