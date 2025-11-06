# app/routers/children.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.child import Child
from app.schemas.child_schema import ChildCreate, ChildUpdate, ChildResponse
from app.routers.deps import get_current_user

router = APIRouter(prefix="/children", tags=["children"])

# ✅ Create
@router.post("/", response_model=ChildResponse)
def create_child(
    child_in: ChildCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    child = Child(**child_in.model_dump())
    db.add(child)
    db.commit()
    db.refresh(child)
    return child


# ✅ Read all
@router.get("/", response_model=List[ChildResponse])
def list_children(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Child).offset(skip).limit(limit).all()


# ✅ Read one
@router.get("/{child_id}", response_model=ChildResponse)
def get_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    return child


# ✅ Update
@router.put("/{child_id}", response_model=ChildResponse)
def update_child(
    child_id: int,
    child_in: ChildUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not enough permissions")

    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    for key, value in child_in.model_dump(exclude_unset=True).items():
        setattr(child, key, value)

    db.commit()
    db.refresh(child)
    return child


# ✅ Delete
@router.delete("/{child_id}")
def delete_child(
    child_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete children")

    child = db.query(Child).filter(Child.id == child_id).first()
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")

    db.delete(child)
    db.commit()
    return {"detail": "Child deleted successfully"}
