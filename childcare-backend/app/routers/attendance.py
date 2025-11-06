from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.attendance import Attendance
from app.models.child import Child
from app.schemas.attendance_schema import AttendanceCreate, AttendanceUpdate, AttendanceResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/attendance", tags=["attendance"])

# ✅ Create
@router.post("/", response_model=AttendanceResponse)
def create_attendance(att_in: AttendanceCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    child = db.query(Child).filter(Child.id == att_in.child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    att = Attendance(**att_in.model_dump())
    db.add(att)
    db.commit()
    db.refresh(att)
    return att


# ✅ List all
@router.get("/", response_model=List[AttendanceResponse])
def list_attendance(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Attendance).all()


# ✅ Get one
@router.get("/{attendance_id}", response_model=AttendanceResponse)
def get_attendance(attendance_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")
    return att


# ✅ Update
@router.put("/{attendance_id}", response_model=AttendanceResponse)
def update_attendance(attendance_id: int, att_update: AttendanceUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")

    if att_update.child_id:
        child = db.query(Child).filter(Child.id == att_update.child_id).first()
        if not child:
            raise HTTPException(status_code=404, detail="Child not found")

    for key, value in att_update.model_dump(exclude_unset=True).items():
        setattr(att, key, value)

    db.commit()
    db.refresh(att)
    return att


# ✅ Delete (both admin & staff)
@router.delete("/{attendance_id}")
def delete_attendance(attendance_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    att = db.query(Attendance).filter(Attendance.id == attendance_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attendance not found")

    db.delete(att)
    db.commit()
    return {"message": "Attendance deleted successfully"}
