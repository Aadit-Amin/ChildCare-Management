# scripts/seed.py
import sys
from pathlib import Path

# Add project root to sys.path to import 'app' module
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.utils import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

# Open DB session
db = SessionLocal()

# Admin credentials
ADMIN_EMAIL = "admin@childcare.com"
ADMIN_PASSWORD = "hello@123"

# Check if admin exists
admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
if not admin_user:
    admin = User(
        name="Admin",
        email=ADMIN_EMAIL,
        password_hash=get_password_hash(ADMIN_PASSWORD),
        role="admin"
    )
    db.add(admin)
    db.commit()
    print(f"✅ Admin user created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
else:
    print("ℹ️ Admin user already exists")

db.close()
