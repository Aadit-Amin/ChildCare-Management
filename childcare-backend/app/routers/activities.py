# app/routers/activities.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.activity import Activity
from app.schemas.activity_schema import ActivityCreate, ActivityUpdate, ActivityResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/activities", tags=["activities"])

# ✅ Create Activity
@router.post("/", response_model=ActivityResponse, status_code=status.HTTP_201_CREATED)
def create_activity(activity_in: ActivityCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    activity = Activity(**activity_in.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

# ✅ List all Activities
@router.get("/", response_model=List[ActivityResponse])
def list_activities(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Activity).all()

# ✅ Get single Activity
@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity

# ✅ Update Activity
@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(activity_id: int, activity_in: ActivityUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    update_data = activity_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(activity, key, value)

    db.commit()
    db.refresh(activity)
    return activity

# ✅ Delete Activity
@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(activity_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete activities")

    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    db.delete(activity)
    db.commit()
    return {"detail": "Activity deleted successfully"}
