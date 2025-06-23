# Whispr Project - Setup & Run Instructions

## Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (for backend database)

## 1. Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

- Create a `.env` file in `backend/` with:
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/whispr
  JWT_SECRET=your_jwt_secret
  GROQ_API_KEY=your_groq_api_key
  ```
- Make sure your PostgreSQL server is running and the database exists.

- Start the backend server:
```bash
uvicorn app.main:app --reload
```

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

- The frontend will run on [http://localhost:3000](http://localhost:3000)
- The backend will run on [http://localhost:8000](http://localhost:8000)

## 3. Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Login, generate podcast scripts, and listen to the podcast audio.

---

**Note:**
- If you change backend/frontend ports, update the `baseURL` in `frontend/src/lib/api.ts`.
- For production, set secure environment variables and configure CORS accordingly.
