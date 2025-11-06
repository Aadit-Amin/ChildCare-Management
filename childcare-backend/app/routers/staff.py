# app/routers/staff.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.staff import Staff
from app.models.user import User
from app.schemas.staff_schema import StaffCreate, StaffResponse, StaffUpdate
from app.routers.deps import get_current_user

router = APIRouter(prefix="/staff", tags=["staff"])


# ✅ Create staff profile
@router.post("/", response_model=StaffResponse)
def create_staff(
    staff_in: StaffCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    existing = db.query(Staff).filter(Staff.user_id == staff_in.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff profile already exists")

    staff = Staff(**staff_in.model_dump())
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return staff


# ✅ List all staff (includes related user info)
@router.get("/", response_model=List[StaffResponse])
def list_staff(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    staffs = db.query(Staff).all()
    return staffs


# ✅ Get staff by ID
@router.get("/{staff_id}", response_model=StaffResponse)
def get_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    return staff


# ✅ Update staff
@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    staff_in: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    for key, value in staff_in.model_dump(exclude_unset=True).items():
        setattr(staff, key, value)

    db.commit()
    db.refresh(staff)
    return staff


# ✅ Delete staff
@router.delete("/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete staff")

    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    db.delete(staff)
    db.commit()
    return {"detail": "Staff deleted successfully"}
