# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.config import settings

# Import routers explicitly from app.routers
from app.routers.auth import router as auth_router
from app.routers.children import router as children_router
from app.routers.staff import router as staff_router
from app.routers.attendance import router as attendance_router
from app.routers.health_records import router as health_record_router
from app.routers.activities import router as activities_router
from app.routers.billing import router as billing_router

# Import models so SQLAlchemy metadata is registered
from app.models import (
    user,
    staff as staff_model,
    child,
    attendance,
    health_record,
    activity as activities_model,
    billing as billing_model
)  # noqa: F401

# Create tables on startup (safe even in production)
@app.on_event("startup")
def on_startup():
    print("🧱 Creating tables if not exist...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables verified/created successfully.")
    except Exception as e:
        print("❌ Table creation failed:", e)


# Initialize FastAPI app
app = FastAPI(title="Child Care Center Management System - API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(children_router)
app.include_router(staff_router)
app.include_router(attendance_router)
app.include_router(health_record_router)
app.include_router(activities_router)
app.include_router(billing_router)


@app.get("/")
def read_root():
    return {"message": "Child Care Center Management API"}
