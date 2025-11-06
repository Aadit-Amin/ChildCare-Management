from sqlalchemy import Column, Integer, ForeignKey, Numeric, String, Date, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Billing(Base):
    __tablename__ = "billing"

    id = Column(Integer, primary_key=True, index=True)
    child_id = Column(Integer, ForeignKey("children.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(32), nullable=False, default="Unpaid")
    issued_date = Column(Date, default=func.current_date())
    due_date = Column(Date)
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    child = relationship("Child", back_populates="billings")
