# 🏥 Doctor PMS (Patient Management System)

A full-stack **Doctor Patient Management System** built using **FastAPI (Backend)** and **React + Vite (Frontend)**.

This system helps **Admins** and **Doctors** manage patients, prescriptions, medical reports, and AI summaries efficiently.

---

## ✨ Features

### 👨‍⚕️ User Roles

#### **Admin**
- Add new patients
- Edit patient details
- View all patients

#### **Doctor**
- View patient list
- Search & filter patients
- Add prescriptions
- Upload medical reports
- View AI-generated patient summary

---

### 📋 Core Modules
- Patient list with search & filters
- Patient profile tabs:
  - Overview
  - Prescriptions
  - Reports
  - AI Summary
- Prescription management
- Medical report upload & download
- Authentication (Admin / Doctor)

---

## 🗂 Project Structure
# 🏥 Doctor PMS (Patient Management System)

A full-stack **Doctor Patient Management System** built using **FastAPI (Backend)** and **React + Vite (Frontend)**.

This system helps **Admins** and **Doctors** manage patients, prescriptions, medical reports, and AI summaries efficiently.

---

## ✨ Features

### 👨‍⚕️ User Roles

#### **Admin**
- Add new patients
- Edit patient details
- View all patients

#### **Doctor**
- View patient list
- Search & filter patients
- Add prescriptions
- Upload medical reports
- View AI-generated patient summary

---

### 📋 Core Modules
- Patient list with search & filters
- Patient profile tabs:
  - Overview
  - Prescriptions
  - Reports
  - AI Summary
- Prescription management
- Medical report upload & download
- Authentication (Admin / Doctor)

---

## 🗂 Project Structure
doctor-pms/
│
├── backend/
│ ├── main.py
│ ├── models.py
│ ├── schemas.py
│ ├── database.py
│ └── uploads/
│
├── frontend/
│ └── doctorms/
│ ├── src/
│ ├── public/
│ ├── package.json
│ ├── vite.config.ts
│ └── index.html
│
├── doctor_pms.db
├── requirements.txt
└── README.md


---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Custom CSS UI

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

---

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/VinitHudiya19/doctor-pms.git
cd doctor-pms
``` 
## 🔧 Backend Setup (FastAPI)

### 2️⃣ Create Virtual Environment
```bash
cd backend
python -m venv venv
```
### 3️⃣ Activate Virtual Environment
### Windows
```bash
venv\Scripts\activate
```
### 4️⃣ Install Dependencies
```bash
pip install -r requirements.txt
```
### 5️⃣ Run Backend Server
```bash
uvicorn main:app --reload
```
✅ Backend will run at: 👉 http://localhost:8000

👉 API Docs: http://localhost:8000/docs

## 2️⃣ Frontend Setup (React + Vite)
Open a new terminal window for the frontend.

# Navigate to the frontend directory
# (Adjust path based on your folder structure if needed)
``` bash
cd ../frontend/doctorms
```
### 6️⃣ Install Dependencies
```bash
npm install
```
### 7️⃣ Start Frontend
```bash
npm run dev
```
✅ Frontend will run at: 👉 http://localhost:5173



https://github.com/user-attachments/assets/08af18b8-7171-4155-a808-fde3ffcc94c0


