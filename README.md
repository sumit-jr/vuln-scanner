# 🔍 VulnSight — Advanced Vulnerability Scanner

A full-stack cybersecurity intelligence dashboard designed to perform automated reconnaissance, vulnerability assessment, and security analysis on web applications and domains.

Built with modern web technologies and security-focused architecture, VulnSight provides real-time scanning, risk assessment, technology fingerprinting, SSL inspection, XSS/SQLi testing, and exportable security reports through an interactive dashboard.

---

## 🌐 Live Demo

### Frontend
https://vuln-scanner-rho.vercel.app/

### Backend API
https://vuln-sight.onrender.com/docs

---

## 🚀 Features

### 🔐 Security Header Analysis
- Detects missing security headers
- Analyzes HTTP response headers
- Provides remediation recommendations

### 🌐 Open Port Scanning
- Detects common open ports
- Service banner grabbing
- Basic network reconnaissance

### 🧠 Technology Fingerprinting
- Detects frontend/backend technologies
- Framework identification
- Technology confidence scoring

### 📂 Directory Discovery
- Detects exposed paths and directories
- Finds common endpoints
- Reconnaissance scanning

### ⚠️ XSS Detection
- Tests multiple reflected XSS payloads
- Parameter-based injection testing
- Payload visualization dashboard

### 🛡 SQL Injection Testing
- Basic SQL injection payload testing
- Heuristic vulnerability analysis

### 🔒 SSL/TLS Analysis
- SSL certificate validation
- Issuer information
- Expiry date monitoring

### 📊 Risk Assessment Dashboard
- Overall risk classification
- Vulnerability statistics
- Security scoring system

### 📁 Report Management
- Export scan reports as JSON
- PDF export support
- Scan history tracking

### 🎨 Modern Cybersecurity UI
- Responsive dashboard
- Dark cyberpunk-inspired interface
- Interactive vulnerability cards

---

## 🛠 Tech Stack

## Backend
- Python
- FastAPI
- Requests
- Python-Nmap
- Uvicorn
- WeasyPrint
- Docker

## Frontend
- React
- Vite
- TailwindCSS
- Axios
- Lucide React Icons

## Deployment
- Vercel (Frontend)
- Render (Backend)
- GitHub (Version Control)

---

## 📂 Project Structure

```bash
vuln-scanner/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── reports/
│   ├── logs/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# ⚡ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/vuln-scanner.git

cd vuln-scanner
```

---

# 🔧 Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at:

```bash
http://127.0.0.1:8000
```

Swagger API Docs:

```bash
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 🔑 Environment Variables

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://127.0.0.1:8000
```

For production:

```env
VITE_API_URL=https://vuln-sight.onrender.com
```

---

# 📡 API Endpoints

## Root Endpoint

```http
GET /
```

---

## Scan Target

```http
POST /scan
```

### Example Request

```json
{
  "url": "https://example.com"
}
```

---

## Get Reports

```http
GET /reports
```

---

## Delete Report

```http
DELETE /reports/{file_name}
```

---

# 📸 Screenshots

## Dashboard

![Dashboard](./frontend/screenshots/dashboard.png)

## Scan Results

![Google Scan](./frontend/screenshots/google-scan.png)

---

# 🧠 How It Works

1. User submits a target URL
2. FastAPI backend initiates scanning modules
3. Reconnaissance and vulnerability checks execute
4. Results are aggregated into structured JSON
5. Frontend renders interactive dashboard visualization
6. Reports can be exported and stored

---

# 🔮 Future Improvements

- Advanced CVE intelligence integration
- Authentication & user accounts
- Scan scheduling
- Real-time scan progress tracking
- WebSocket support
- Subdomain enumeration
- WAF detection
- Rate limiting detection
- AI-assisted vulnerability analysis
- Improved false-positive filtering
- Kubernetes deployment support

---

# ⚠️ Disclaimer

This project is developed strictly for:
- Educational purposes
- Security research
- Authorized security testing

Do NOT scan systems without proper authorization.

---

# 👨‍💻 Author

### Sumit Sah

Cybersecurity • Full-Stack Development • Security Engineering

GitHub:
https://github.com/sumit-jr

---

# ⭐ Support

If you found this project useful:

- Star the repository
- Fork the project
- Contribute improvements
- Share feedback

---
