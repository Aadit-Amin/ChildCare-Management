# app/routers/health_records.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.health_record import HealthRecord
from app.models.child import Child
from app.schemas.health_record_schema import (
    HealthRecordCreate,
    HealthRecordUpdate,
    HealthRecordResponse,
)
from app.routers.deps import get_current_user

router = APIRouter(prefix="/health-records", tags=["health-records"])

# ✅ Create
@router.post("/", response_model=HealthRecordResponse)
def create_record(
    record_in: HealthRecordCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    # Ensure valid child
    child = db.query(Child).filter(Child.id == record_in.child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail=f"Child with id {record_in.child_id} not found")

    # If staff creates, store their name automatically
    record_data = record_in.model_dump()
    if current_user.role == "staff":
        record_data["doctor_name"] = current_user.name

    record = HealthRecord(**record_data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


# ✅ Read all
@router.get("/", response_model=List[HealthRecordResponse])
def list_records(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    query = db.query(HealthRecord)

    # Admin → sees all records
    if current_user.role == "admin":
        return query.all()

    # Staff → sees only their own records
    if current_user.role == "staff":
        return query.filter(HealthRecord.doctor_name == current_user.name).all()

    # Others → forbidden
    raise HTTPException(status_code=403, detail="Not enough permissions")


# ✅ Read one
@router.get("/{record_id}", response_model=HealthRecordResponse)
def get_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    # Admin can access any
    if current_user.role == "admin":
        return record

    # Staff can only access their own records
    if current_user.role == "staff" and record.doctor_name == current_user.name:
        return record

    raise HTTPException(status_code=403, detail="Not enough permissions")


# ✅ Update
@router.put("/{record_id}", response_model=HealthRecordResponse)
def update_record(
    record_id: int,
    record_in: HealthRecordUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    record = db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    # Staff can update only their own records
    if current_user.role == "staff" and record.doctor_name != current_user.name:
        raise HTTPException(status_code=403, detail="You can only update your own records")

    for key, value in record_in.model_dump(exclude_unset=True).items():
        setattr(record, key, value)

    db.commit()
    db.refresh(record)
    return record


# ✅ Delete
@router.delete("/{record_id}")
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    record = db.query(HealthRecord).filter(HealthRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Health record not found")

    # Admin can delete any record
    if current_user.role == "admin":
        db.delete(record)
        db.commit()
        return {"detail": "Health record deleted successfully"}

    # Staff can delete only their own records
    if current_user.role == "staff" and record.doctor_name == current_user.name:
        db.delete(record)
        db.commit()
        return {"detail": "Health record deleted successfully"}

    raise HTTPException(status_code=403, detail="Not enough permissions")
