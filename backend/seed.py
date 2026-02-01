from datetime import datetime
import json

from database import SessionLocal, engine
from models import Base, User, Patient, Prescription, Report

# ✅ CREATE TABLES FIRST
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_users():
    print("Seeding users...")
    users = [
        User(username="admin", password="admin123", role="ADMIN"),
        User(username="doctor", password="doctor123", role="DOCTOR")
    ]
    db.add_all(users)
    db.commit()


def seed_patients():
    print("Seeding patients...")
    patients = [
        Patient(name="Rajesh Kumar", age=45, gender="Male"),
        Patient(name="Priya Desai", age=32, gender="Female"),
        Patient(name="Amitabh Singh", age=68, gender="Male"),
        Patient(name="Sarah Jenkins", age=28, gender="Female"),
        Patient(name="Vikram Malhotra", age=52, gender="Male")
    ]
    db.add_all(patients)
    db.commit()
    return patients


def seed_prescriptions(patients):
    print("Seeding prescriptions...")

    for patient in patients:
        medicines = [
            {
                "name": "Paracetamol",
                "dosage": "500mg",
                "frequency": "1-0-1",
                "duration": "5 days"
            },
            {
                "name": "Cetirizine",
                "dosage": "10mg",
                "frequency": "0-0-1",
                "duration": "3 days"
            }
        ]

        prescription = Prescription(
            patient_id=patient.id,
            doctor_name="doctor",
            diagnosis="Viral Fever",
            medicines=json.dumps(medicines),
            notes="Drink plenty of fluids and take rest",
            created_at=datetime.utcnow()
        )

        db.add(prescription)

    db.commit()


def seed_reports(patients):
    print("Seeding reports...")

    for patient in patients:
        report = Report(
            patient_id=patient.id,
            doctor_name="doctor",
            title="Blood Test Report",
            file_path=f"uploads/{patient.id}_blood_report.pdf",
            created_at=datetime.utcnow()
        )

        db.add(report)

    db.commit()


def main():
    try:
        seed_users()
        patients = seed_patients()
        seed_prescriptions(patients)
        # seed_reports(patients)
        print("✅ Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print("❌ Error while seeding:", e)
    finally:
        db.close()


if __name__ == "__main__":
    main()
