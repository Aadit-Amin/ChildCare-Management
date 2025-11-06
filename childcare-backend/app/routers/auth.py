# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from datetime import timedelta
from app.database import get_db
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin, UserUpdate
from app.models.user import User
from app.models.staff import Staff
from app.utils import get_password_hash, verify_password, create_access_token
from app.routers.deps import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Token response schema ---
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Register ---
@router.post("/register", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        name=user_in.name,
        email=user_in.email,
        password_hash=get_password_hash(user_in.password),
        role=user_in.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Auto-create staff entry if role is "staff"
    if user.role == "staff":
        # Check if staff entry already exists (prevent duplicates)
        existing_staff = db.query(Staff).filter(Staff.user_id == user.id).first()
        if not existing_staff:
            staff = Staff(
                user_id=user.id,
                contact=None,
                position=None,
                assigned_room=None,
                hire_date=None
            )
            db.add(staff)
            db.commit()
    
    return user


# --- Login ---
@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}


# --- Get current user ---
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# --- Update user ---
@router.put("/update/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Track if role is being changed to "staff"
    role_changed_to_staff = False
    if "role" in user_in.model_dump(exclude_unset=True):
        new_role = user_in.model_dump(exclude_unset=True)["role"]
        role_changed_to_staff = (new_role == "staff" and user.role != "staff")

    for key, value in user_in.model_dump(exclude_unset=True).items():
        if key == "password":
            value = get_password_hash(value)
            key = "password_hash"
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    
    # Auto-create staff entry if role was changed to "staff"
    if role_changed_to_staff:
        existing_staff = db.query(Staff).filter(Staff.user_id == user.id).first()
        if not existing_staff:
            staff = Staff(
                user_id=user.id,
                contact=None,
                position=None,
                assigned_room=None,
                hire_date=None
            )
            db.add(staff)
            db.commit()
    
    return user


# --- Delete user ---
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can delete users")

    # Prevent self-deletion
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        db.delete(user)
        db.commit()
        return {"detail": "User deleted successfully"}
    except IntegrityError as e:
        db.rollback()
        error_msg = str(e.orig) if hasattr(e, 'orig') else str(e)
        raise HTTPException(
            status_code=400,
            detail="Cannot delete user: This user is referenced by other records. Please remove associated data first."
        )
    except SQLAlchemyError as e:
        db.rollback()
        error_msg = str(e)
        raise HTTPException(
            status_code=500,
            detail=f"Database error while deleting user: {error_msg}"
        )
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete user: {error_msg}"
        )

# --- List all users (admin only) ---
@router.get("/", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can view all users")

    users = db.query(User).all()
    return users

# --- List users eligible to become staff ---
@router.get("/available-staff-users", response_model=list[UserResponse])
def get_available_staff_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can see this
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can view this list")

    # Get all users with role 'staff' who don't already have a Staff profile
    users = (
        db.query(User)
        .filter(User.role == "staff")
        .filter(~User.staff_profile.has())  # exclude those who already have staff profile
        .all()
    )
    return users
# --- Change password (self) ---
class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str


@router.put("/change-password")
def change_password(
    data: PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password first
    if not verify_password(data.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    # Update new password
    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"detail": "Password updated successfully"}


# --- Admin reset staff password ---
class AdminPasswordResetRequest(BaseModel):
    new_password: str


@router.put("/admin/change-password/{user_id}")
def admin_change_password(
    user_id: int,
    data: AdminPasswordResetRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can use this route
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can change other users' passwords")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(data.new_password)
    db.commit()
    return {"detail": f"Password reset for {user.email}"}
