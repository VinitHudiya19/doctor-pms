from pydantic import BaseModel

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str

class PatientResponse(PatientCreate):
    id: int

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    role: str
    username: str


from typing import List
from datetime import datetime

class Medicine(BaseModel):
    name: str
    dosage: str
    frequency: str
    duration: str

class PrescriptionCreate(BaseModel):
    patient_id: int
    doctor_name: str
    diagnosis: str
    medicines: List[Medicine]
    notes: str | None = None

class PrescriptionResponse(PrescriptionCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    id: int
    patient_id: int
    doctor_name: str
    title: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True
