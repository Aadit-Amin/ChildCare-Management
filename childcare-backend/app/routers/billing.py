# app/routers/billing.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.billing import Billing
from app.schemas.billing_schema import BillingCreate, BillingResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/billing", tags=["billing"])

# ✅ Create a billing record
@router.post("/", response_model=BillingResponse)
def create_billing(
    billing_in: BillingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    billing = Billing(**billing_in.model_dump())
    db.add(billing)
    db.commit()
    db.refresh(billing)
    return billing

# ✅ List all billing records
@router.get("/", response_model=List[BillingResponse])
def list_billing(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Billing).all()

# ✅ Get a single billing record by ID
@router.get("/{billing_id}", response_model=BillingResponse)
def get_billing(
    billing_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    billing = db.query(Billing).filter(Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing record not found")
    return billing

# ✅ Update a billing record
@router.put("/{billing_id}", response_model=BillingResponse)
def update_billing(
    billing_id: int,
    billing_in: BillingCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    billing = db.query(Billing).filter(Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing record not found")

    for key, value in billing_in.model_dump().items():
        setattr(billing, key, value)

    db.commit()
    db.refresh(billing)
    return billing

# ✅ Delete a billing record
@router.delete("/{billing_id}")
def delete_billing(
    billing_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    billing = db.query(Billing).filter(Billing.id == billing_id).first()
    if not billing:
        raise HTTPException(status_code=404, detail="Billing record not found")

    db.delete(billing)
    db.commit()
    return {"detail": "Billing record deleted successfully"}
