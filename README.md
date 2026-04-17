````markdown
# InsightlyAI — Sales Intelligence Platform

InsightlyAI is a full-stack, AI-powered sales intelligence platform. It allows users to upload raw sales data (CSV/Excel) and instantly generates interactive dashboards, predictive forecasts using Prophet, and deep actionable insights using Groq LLMs.

---

## 🌟 Features

- **Instant Dashboards**: Upload a dataset and automatically get KPI cards, trend lines, and category visualizations without manual configuration.
- **AI-Powered Insights**: Uses Groq-powered LLMs to generate executive summaries, top performers, anomalies, and actionable business recommendations from your dataset.
- **Prophet Forecasting**: Built-in 90-day time-series forecasting for revenue and sales metrics.
- **PDF Export**: One-click download of a beautifully formatted PDF report containing all AI insights and data summaries.
- **Supabase Authentication**: Secure, modern authentication using Supabase (email/password-based login & signup).
- **Mobile Responsive UI**: Fully responsive dashboard with a collapsible hamburger sidebar for mobile devices.
- **Sleek UI**: Premium dark-mode-first design built with Next.js, Tailwind CSS, and shadcn/ui.

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- React & Tailwind CSS
- Recharts (Data Visualization)
- Lucide Icons & shadcn/ui
- Supabase JS Client (Authentication)

### Backend
- Python & Flask
- Supabase (Auth and Database)
- ReportLab (PDF Generation)
- Prophet (Time-series Forecasting)
- Groq API (LLM Insights)

---

## 🚀 Setup Instructions (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/piyushb03/InsightlyAI.git
cd InsightlyAI
````

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Environment variables
echo "GROQ_API_KEY=your_api_key" > .env
echo "JWT_SECRET=your_secret_key" >> .env

# Run server
python main.py
```

*Backend runs at:* `http://localhost:8000`
---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" >> .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env.local

# Run development server
npm run dev
```
*The frontend will be available at `http://localhost:3000`*

---

## 🌍 Deployment Instructions

### Backend (Render)
The backend is designed to be easily deployed on [Render.com](https://render.com) using the included `Procfile`.

1. Create a new **Web Service** on Render.
2. Link your GitHub repository.
3. Configure the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT main:app`
4. Add your Environment Variables (`GROQ_API_KEY`, `JWT_SECRET`, `CORS_ORIGINS`).
5. Deploy!

### Frontend (Vercel)
The frontend is optimized for deployment on [Vercel](https://vercel.com).

1. Import your GitHub repository into Vercel.
2. Set the **Framework Preset** to Next.js.
3. Set the **Root Directory** to `frontend`.
4. Add the Environment Variable: `NEXT_PUBLIC_API_URL` (pointing to your Render backend URL).
5. Deploy! Vercel will automatically build and publish your site.

> **Note on Cold Starts:** Render free-tier servers go to sleep after inactivity. The frontend intelligently pings the `/health` endpoint in the background to wake the server gracefully and provides users with a sleek "Initializing AI Engine" loading screen.

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/health` | Application health check. Crucial for waking up Render servers. |
| **POST** | `/api/auth/signup` | Register a new user. |
| **POST** | `/api/auth/login` | Authenticate and retrieve JWT token. |
| **POST** | `/api/uploads/` | Upload and securely parse a CSV/Excel dataset. |
| **GET** | `/api/dashboards/<id>` | Fetch parsed dashboard configurations and statistics. |
| **POST** | `/api/insights/<upload_id>/generate` | Trigger LLM to generate insights from statistics. |
| **POST** | `/api/forecast/<upload_id>/generate` | Generate 90-day Prophet forecast. |
| **GET** | `/api/export-report/<upload_id>` | Generate and download a PDF report containing AI insights. |

---
## 🎥 Demo

*A comprehensive screen recording demonstrating the data upload, dashboard generation, and AI insights workflow will be uploaded here shortly.*
