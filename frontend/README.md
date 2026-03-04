# InsightlyAI — Frontend

Next.js 16 (App Router) frontend for InsightlyAI, written in JavaScript.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

## Environment

Create `frontend/.env.local`:
```
FASTAPI_URL=http://localhost:8000
```

## Stack

- Next.js 16, JavaScript (JSX), Tailwind CSS v4
- shadcn/ui, Recharts, react-dropzone
- API proxy routes → Flask backend on port 8000
