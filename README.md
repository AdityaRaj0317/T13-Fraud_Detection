🚨 T13 Fraud Detection System
AI-Powered Login Security with Risk Scoring, OTP & Real-Time Threat Dashboard

This project is a complete Fraud Detection & Intelligent Authentication System built using the MERN stack + Machine Learning + TailwindCSS + Vite + React.

It detects abnormal login attempts, applies dynamic risk scoring, triggers OTP verification for risky logins, blocks malicious attempts, and provides a full real-time security dashboard for the admin.

📌 Features
🔐 Authentication & Risk Engine

Username + Password login

Metadata extraction (IP, User-Agent, Device, Time)

Geo-location lookup

Velocity & brute-force detection

ML-powered anomaly scoring (optional Python microservice)

Final risk score:

0–30 → Allow login

31–70 → OTP required

71–100 → Block

📲 OTP Verification

Email-based OTP

Auto-expiring OTP tokens stored in DB

Triggered on medium-risk logins

📊 Admin Dashboard (React + Tailwind + Vite)

✔ Overview metrics
✔ Live Threat Map (country grouped)
✔ Incident log with filtering + details modal
✔ Security rules configuration panel
✔ Auto-refresh
✔ Dark mode toggle

⚡ Tech Stack

Frontend: React, Vite, TailwindCSS, lucide-react

Backend: Node.js, Express

Database: MongoDB

ML (Optional): Python (FastAPI) + Isolation Forest

Geo API: ipinfo / ip-api / MaxMind

Others: PostCSS, JWT, bcrypt, nodemailer

🏗 Project Structure
T13-Fraud_Detection/
│
├── Backend/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.js
│   └── README.md (api docs)
│
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── components/
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── package.json
│
└── ml-service/ (optional)
    ├── app.py
    ├── train_model.py
    ├── iso_model.joblib
    └── requirements.txt

⚙ Setup Instructions
1️⃣ Clone the repository
git clone <repo-url>
cd T13-Fraud_Detection

2️⃣ Install Backend Dependencies
cd Backend
npm install
npm start


Create .env:

MONGO_URI=your_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password

3️⃣ Install Frontend Dependencies
cd Frontend
npm install
npm run dev


Make sure Tailwind v4 is configured using:

@tailwindcss/postcss

4️⃣ (Optional) ML Microservice Setup
cd ml-service
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

🚀 How It Works
Login Request Flow

User submits username + password

Backend verifies password

Metadata collected → risk engine → ML model

Based on risk:

Low: JWT returned

Medium: OTP emailed

High: Attempt blocked

Every attempt logged with geo + device + risk score

Admin dashboard displays all events in real-time

🖥 Admin Dashboard Features
Overview Page

Total logins

Suspicious attempts

Blocked attempts

Active users

Threat Map Page

Shows grouped login attempts by country

Color-coded risk level

Detailed modal for each threat

Incident Log Page

Full table of login attempts

Filters: type, risk score

Modal with complete event info

Rule Configuration Page

Add / edit / delete security rules

Toggle rules on/off

Threshold controls

Dark Mode

Global theme toggle

Persistent across reloads

🧪 Demo Scenarios

✔ Normal login from known device → success
✔ Login from VPN / new country → OTP triggered
✔ Brute force script → IP blocked
✔ Multiple anomalies → dashboard lights up

🤝 Team (6 Members)

Dashboard UI

Risk Engine

OTP Service

Geo Lookup & Device Fingerprinting

ML Microservice

Backend API + MongoDB
