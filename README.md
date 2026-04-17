# InsightlyAI — Advanced Sales Intelligence SaaS

InsightlyAI is a professional-grade, AI-powered sales intelligence platform designed to transform raw data into actionable business strategy. Upload your sales data (CSV/Excel) and instantly unlock interactive dashboards, predictive forecasts, and an AI-driven data assistant.

---

## 🌟 Key Features

### 1. Interactive AI Data Assistant
- **Chat with your Data**: An interactive chat interface (powered by Groq & Llama-3) that allows you to ask natural language questions about your datasets.
- **Context-Aware Insights**: The assistant understands your dataset's specific schema and statistics to provide accurate, data-driven answers.

### 2. Data & History Management
- **Personal Workspace**: A dedicated area to manage your data history. View every upload, its row count, and processing status.
- **Smart Cleanup**: Delete datasets with one click; the system automatically cleans up associated raw files, database records, and AI-generated insights.
- **Advanced Search & Sort**: Quickly find specific dashboards using the real-time search and filter system.

### 3. Advanced Analytics & Forecasting
- **Customizable Forecasting**: Use the Prophet-powered forecaster to predict future trends. Choose your specific target metrics and look 90 days ahead.
- **Auto-Generated Dashboards**: Instant visualizations (KPI cards, Trend lines, Category charts) tailored to your dataset without manual config.
- **PDF Export**: Generate and download professional PDF reports of your findings.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS & shadcn/ui
- **Auth**: Supabase SSR (@supabase/ssr)
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Engine**: Python & Flask
- **Data Store**: Supabase (Postgres & RLS)
- **AI Engine**: Groq (Llama-3.3-70b-versatile)
- **Forecasting**: Prophet (Time-series)
- **Storage**: Supabase Storage (Avatars & Datasets)
- **Reports**: ReportLab (PDF)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/piyushb03/InsightlyAI.git
cd InsightlyAI
```

### 2. Backend Configuration
Navigate to `/backend`, install dependencies, and set up your `.env`:
```bash
pip install -r requirements.txt
# .env file
GROQ_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_service_role_key
SECRET_KEY=your_flask_secret
```

### 3. Frontend Configuration
Navigate to `/frontend`, install dependencies, and set up your `.env.local`:
```bash
npm install
# .env.local file
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Run the Platform
- **Backend**: `python main.py` (Runs on port 8000)
- **Frontend**: `npm run dev` (Runs on port 3000)

---

## 📄 Database Setup
Run the following queries in your Supabase SQL Editor:
- [SQL for Profiles & Avatars](https://github.com/piyushb03/InsightlyAI/blob/main/README.md) (See implementation guide for specific DDL).

---
