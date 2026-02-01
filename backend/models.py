from sqlalchemy import Column, Integer, String
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)   # plain for now (hackathon)
    role = Column(String) 
          # ADMIN or DOCTOR
from sqlalchemy import ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_name = Column(String, nullable=False)
    diagnosis = Column(String, nullable=False)
    medicines = Column(Text, nullable=False)  # JSON string
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
