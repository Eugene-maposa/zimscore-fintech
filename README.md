# ZimScore Fintech

Zimbabwe's premier fintech platform for credit scoring, P2P lending, and SME financial empowerment.

## 📁 Project Structure

- **`frontend/`**: Vite + React + Tailwind CSS (UI)
- **`backend/`**: FastAPI + EcoCash API Integration
- **`zimscore_credit_scoring_model.py`**: Shared core scoring logic (Rule-based)

## 🚀 How to Run Locally

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:8080`.

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The backend will be available at `http://localhost:8000`. The frontend is already configured to proxy `/api` requests to this port.

## ☁️ Deployment

This project is configured for **Vercel**.
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Functions**: Backend logic is served via Vercel Serverless Functions (Python).

Remember to set your `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and EcoCash credentials in the Vercel Dashboard.
