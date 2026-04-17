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
*Frontend runs at:* `http://localhost:3000`







