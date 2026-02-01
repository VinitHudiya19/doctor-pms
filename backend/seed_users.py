from database import SessionLocal, engine
from models import User, Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()

admin = User(username="admin", password="admin123", role="ADMIN")
doctor = User(username="doctor", password="doctor123", role="DOCTOR")

db.add_all([admin, doctor])
db.commit()
db.close()

print("Users created")
