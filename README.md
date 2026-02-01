Project Structure
doctor-pms/
│
├── frontend/        # React + Vite app
└── backend/         # FastAPI server

🚀 How to Run
1. Clone the Repository
   git clone https://github.com/VinitHudiya19/doctor-pms.git
   cd doctor-pms

🔧 Backend Setup (FastAPI)

2️⃣ Create virtual environment
cd backend
python -m venv venv

venv\Scripts\activate
pip install -r requirements.txt


Run backend
uvicorn main:app --reload

Backend will run at :
http://localhost:8000

Frontend Setup (React)
Install dependencies
cd ../frontend
npm install

Start frontend
npm run dev

Frontend will run at:
http://localhost:5173

