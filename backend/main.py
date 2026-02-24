from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import engine, SessionLocal
from models import Base, Patient, User, Prescription, Report
from schemas import (
    LoginRequest,
    LoginResponse,
    PatientCreate,
    PatientResponse,
    PrescriptionCreate,
    PrescriptionResponse,
    ReportResponse
)
import json
import os
from fastapi.middleware.cors import CORSMiddleware
import requests
from pathlib import Path
import json
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Patient, Prescription, Report

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
AI_MODEL_URL = "http://localhost:8001/api/v1/summarize"
UPLOAD_DIR = Path("uploads")
app = FastAPI()

# ✅ THEN add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DB --------------------
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- ROOT --------------------
@app.get("/")
def root():
    return {"message": "Backend running"}

# -------------------- AUTH --------------------
@app.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == data.username,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "role": user.role,
        "username": user.username
    }

# -------------------- PATIENTS --------------------
@app.get("/patients", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).all()

@app.post("/patients", response_model=PatientResponse)
def create_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(
        name=patient.name,
        age=patient.age,
        gender=patient.gender
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@app.put("/patients/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    db_patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    db_patient.name = patient.name
    db_patient.age = patient.age
    db_patient.gender = patient.gender

    db.commit()
    db.refresh(db_patient)
    return db_patient

# -------------------- PRESCRIPTIONS --------------------

def serialize_prescription(p: Prescription):
    return {
        "id": p.id,
        "patient_id": p.patient_id,
        "doctor_name": p.doctor_name,
        "diagnosis": p.diagnosis,
        "medicines": json.loads(p.medicines),  # ✅ FIX
        "notes": p.notes,
        "created_at": p.created_at
    }

@app.post("/prescriptions", response_model=PrescriptionResponse)
def add_prescription(
    data: PrescriptionCreate,
    db: Session = Depends(get_db)
):
    prescription = Prescription(
        patient_id=data.patient_id,
        doctor_name=data.doctor_name,
        diagnosis=data.diagnosis,
        medicines=json.dumps([m.dict() for m in data.medicines]),
        notes=data.notes
    )

    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # ✅ RETURN SERIALIZED DATA
    return serialize_prescription(prescription)

@app.get(
    "/patients/{patient_id}/prescriptions",
    response_model=list[PrescriptionResponse]
)
def get_prescriptions(patient_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(Prescription)
        .filter(Prescription.patient_id == patient_id)
        .order_by(Prescription.created_at.desc())
        .all()
    )

    return [serialize_prescription(r) for r in records]

# -------------------- REPORTS --------------------
@app.post("/reports", response_model=ReportResponse)
def upload_report(
    patient_id: int = Form(...),
    doctor_name: str = Form(...),
    title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    file_path = f"{UPLOAD_DIR}/{patient_id}_{file.filename}"

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    report = Report(
        patient_id=patient_id,
        doctor_name=doctor_name,
        title=title,
        file_path=file_path
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report

@app.get("/patients/{patient_id}/reports", response_model=list[ReportResponse])
def get_reports(patient_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Report)
        .filter(Report.patient_id == patient_id)
        .order_by(Report.created_at.desc())
        .all()
    )
@app.post("/patient-summary/{patient_id}")
def patient_summary(patient_id: int, db: Session = Depends(get_db)):

    # ---------------- PATIENT ----------------
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not patient:
        raise HTTPException(404, "Patient not found")

    # ---------------- PRESCRIPTIONS ----------------
    prescriptions = db.query(Prescription)\
        .filter(Prescription.patient_id == patient_id).all()

    prescription_text = ""

    for p in prescriptions:
        meds = json.loads(p.medicines)

        med_lines = "\n".join([
            f"- {m['name']} ({m['dosage']}, {m['frequency']}, {m['duration']})"
            for m in meds
        ])

        prescription_text += f"""
Doctor: {p.doctor_name}
Diagnosis: {p.diagnosis}
Medicines:
{med_lines}
Notes: {p.notes or "None"}
"""

    # ---------------- REPORT FILE TEXT ----------------
    reports = db.query(Report)\
        .filter(Report.patient_id == patient_id).all()

    reports_text = ""

    for r in reports:
        file_path = UPLOAD_DIR / Path(r.file_path).name

        if file_path.exists():
            # simple fallback (filename info)
            reports_text += f"\nReport File: {file_path.name}"

    # ---------------- FINAL PROMPT ----------------
    medical_text = f"""
PATIENT PROFILE
Name: {patient.name}
Age: {patient.age}
Gender: {patient.gender}

PRESCRIPTIONS:
{prescription_text}

REPORTS:
{reports_text}

Generate clinical summary with observations and recommendations.
"""

    # ---------------- CALL AI MODEL SERVER ----------------
    response = requests.post(
        AI_MODEL_URL,
        json={
            "text": medical_text,
            "max_length": 512,
            "temperature": 0.6
        },
        timeout=120
    )

    if response.status_code != 200:
        raise HTTPException(500, "AI model failed")

    data = response.json()

    return {"summary": data["summary"]}

# -------------------- FILE SERVE --------------------
app.mount("/files", StaticFiles(directory="uploads"), name="files")

from database import SessionLocal
from models import User

def seed_users():
    db = SessionLocal()
    if not db.query(User).first():
        db.add(User(username="admin", password="admin123", role="ADMIN"))
        db.add(User(username="doctor", password="doctor123", role="DOCTOR"))
        db.commit()
    db.close()

seed_users()
