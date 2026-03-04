## Project Overview

InsightlyAI is a production-grade SaaS analytics platform that allows enterprises to upload sales data (Excel/CSV), automatically generate dashboards, receive AI-powered insights, perform sales forecasting, and export analytical reports.

The platform combines modern full-stack development, data processing, and AI analysis into a single workflow.s.

## Demo
<img width="1919" height="1005" alt="Screenshot 2026-03-04 143410" src="https://github.com/user-attachments/assets/7578aa06-7e1c-432b-adc7-cb4e3268b88d" />
<img width="1919" height="1010" alt="Screenshot 2026-03-04 143422" src="https://github.com/user-attachments/assets/5532f6ad-8128-417f-9b68-7fe432b0b72c" />
<img width="1919" height="1013" alt="Screenshot 2026-03-04 143437" src="https://github.com/user-attachments/assets/249277e4-8906-479a-bfad-7b0d6bbdd254" />
<img width="1919" height="1010" alt="Screenshot 2026-03-04 143614" src="https://github.com/user-attachments/assets/353aa0c3-9df7-489c-b402-dba574a73b09" />
<img width="1919" height="1008" alt="Screenshot 2026-03-04 143512" src="https://github.com/user-attachments/assets/0b8f4495-442b-45f2-86ce-d5a897978a18" />
<img width="1919" height="1004" alt="Screenshot 2026-03-04 143527" src="https://github.com/user-attachments/assets/314cadaa-f15c-4026-ae5a-f048b0efd82b" />
<img width="1919" height="1004" alt="Screenshot 2026-03-04 143555" src="https://github.com/user-attachments/assets/34bd9e53-534a-457b-b7bb-c5c569cd8d69" />

## Repository Structure

```
insightlyai/
├── frontend/    Next.js 16 (App Router) — UI + API routes
└── backend/     Flask (Python) — auth, data processing, AI, forecasting
```

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend + API | Next.js 16, JavaScript (JSX), Tailwind CSS v4, shadcn/ui, Recharts |
| Backend | Flask, SQLAlchemy, Werkzeug (password hashing), PyJWT |
| Data / AI | pandas, Prophet, Groq API (`llama-3.3-70b-versatile`) via `groq` |
| Database | SQLite (dev) via SQLAlchemy — `backend/instance/insightlyai.db` |
| File Storage | Local filesystem — `backend/uploads/{user_id}/{filename}` |
| Package managers | npm (JS)|

## Commands
```bash
cd backend
pip install -r requirements.txt
```
### Frontend (`frontend/`)
```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
```

### Backend (`backend/`)
```bash
python main.py              # Start Flask dev server (localhost:8000)

```

**Important:** Flask reads `.env` once at startup via `load_dotenv()` in `config.py`. Any changes to `backend/.env` require a Flask restart to take effect.

## Architecture

### Auth Flow
```
Browser → POST /api/auth/login or /signup
  → Next.js API route (app/api/auth/*/route.js)
    → Flask /api/auth/* (Werkzeug password check, PyJWT token)
    → Next.js sets httpOnly cookie: token=<jwt>
  → proxy.js checks cookie on every request
  → Dashboard/upload pages pass token as Authorization: Bearer <jwt>
    → Flask @require_auth decorator validates JWT, attaches request.current_user
```

### Data Flow
```
User uploads file
  → Next.js /api/upload/route.js (streams raw body with duplex:"half" to preserve multipart boundary)
    → Flask POST /api/uploads (saves file, calls ingestor.py synchronously)
    → services/ingestor.py: pandas parse → col_schema + stats
    → _build_dashboard_config() auto-generates dashboard config in DB
    → Returns {upload, dashboard_id}

User clicks "Generate Insights"
  → DashboardGrid (client) → POST /api/insights/[upload_id]/generate
    → Flask /api/insights/<id>/generate → services/insight_engine.py → Groq API
    → Stored + returned as Insight.content JSON

User clicks "Generate Forecast"
  → DashboardGrid (client) → POST /api/forecast/[upload_id]/generate
    → Flask /api/forecast/<id>/generate → services/forecaster.py → Prophet model
    → Stored + returned as Forecast.data JSON array
```

### Frontend App Structure (`frontend/app/`)
- `page.jsx` — Public landing page (glassmorphism dark mode)
- `login/` + `signup/` — Auth pages (client-side fetch to Next.js API routes)
- `dashboard/page.jsx` — Dashboard list (server component, calls Flask directly via `flaskFetch()`)
- `dashboard/[id]/page.jsx` — Individual dashboard (server component; fetches dashboard + insight + forecast, passes to `DashboardGrid`)
- `upload/page.jsx` — File upload (client component, react-dropzone)
- `api/auth/` — login, signup, logout (proxy to Flask, set/clear JWT cookie)
- `api/upload/`, `api/insights/[upload_id]/generate/`, `api/forecast/[upload_id]/generate/`, `api/export/[upload_id]/` — Proxy routes to Flask

**Server vs client component pattern:**
- Server components (`dashboard/page.jsx`, `dashboard/[id]/page.jsx`) call Flask directly using `flaskFetch()` from `lib/api.js` and read the JWT from the cookie store.
- Client components (`DashboardGrid`, `upload/page.jsx`) call the Next.js API proxy routes (never Flask directly).

**Middleware setup (Next.js 16):** Route protection lives in `proxy.js` which exports a `proxy` function and `config` matcher. Next.js 16 uses `proxy.js` directly as the middleware file (no separate `middleware.js` needed).

### Backend Structure (`backend/`)
- `main.py` — Flask app factory, registers all blueprints
- `models.py` — SQLAlchemy models: User, Upload, Dashboard, Insight, Forecast
- `auth_utils.py` — `create_token`, `decode_token`, `@require_auth` decorator
- `database.py` — SQLAlchemy + Flask-Migrate setup
- `config.py` — Settings loaded from `.env`
- `routes/auth.py` — `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- `routes/uploads.py` — File upload, listing, `_build_dashboard_config()` auto-generation
- `routes/dashboards.py` — Dashboard CRUD
- `routes/insights.py` — Insight generation + retrieval
- `routes/forecast.py` — Forecast generation + retrieval
- `routes/export.py` — File download (serves from `uploads/{user_id}/{filename}`)
- `services/ingestor.py` — pandas CSV/Excel parsing
- `services/insight_engine.py` — Groq API call (llama-3.3-70b-versatile), structured JSON output
- `services/forecaster.py` — Prophet time-series forecast

### Data Schemas

**`ingestor.py` return value:**
```python
{
  "row_count": int,
  "col_schema": [{"name": str, "dtype": "date"|"numeric"|"categorical", "unique_count": int, "sample_values": list}],
  "stats": {
    "<col>": {"sum", "mean", "min", "max", "nunique"},          # numeric cols
    "<col>": {"nunique", "top_values": {str: int}},             # categorical cols
    "<col>": {"min", "max", "nunique"},                          # date cols
    "_time_series": {"date_col": str, "series": {"<numCol>": [{"date": "YYYY-MM", "value": float}]}}
  }
}
```

**Dashboard `config` JSON (stored in `dashboards.config`):**
```json
[
  {"type": "SalesLineChart", "date_col": "...", "value_col": "...", "title": "..."},
  {"type": "KPICard", "col": "..."},
  {"type": "CategoryBarChart", "col": "...", "title": "..."}
]
```
Generated automatically by `_build_dashboard_config()` in `routes/uploads.py` on every upload.

**Insight `content` JSON:**
```json
{"summary": "...", "top_performers": [...], "anomalies": [...], "trends": [...], "recommendations": [...]}
```

### Database (SQLite via SQLAlchemy)
Five tables: `users`, `uploads`, `dashboards`, `insights`, `forecasts`.
All user-scoped tables filter by `user_id` in every query (enforced in route handlers).
DB file auto-created at `backend/instance/insightlyai.db` on first run.

## Environment Variables

**`frontend/.env.local`**
```
FASTAPI_URL=http://localhost:8000
```

**`backend/.env`**
```
GROQ_API_KEY=                  # Groq key (console.groq.com) — free tier: 14,400 req/day
DATABASE_URL=                  # Optional — defaults to sqlite:///insightlyai.db
