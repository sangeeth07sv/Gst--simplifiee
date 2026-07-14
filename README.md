# GST Genie — AI GST & Invoice Assistant for MSMEs

Built page-by-page. This commit covers: project scaffolding + **Login page** (frontend) with matching **auth API** (backend): signup, login, forgot-password (stub), Google Sign-In (stub, returns 501 until configured).

## Stack
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL
- Auth: JWT (python-jose) + bcrypt (passlib)

## Run it locally

### 1. Database
```bash
docker compose up -d db
```

### 2. Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edit JWT_SECRET_KEY at minimum
uvicorn app.main:app --reload
```
API runs at http://localhost:8000. Interactive docs at `/docs`.

### 3. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
App runs at http://localhost:3000/login.

## What's real vs. stubbed right now
| Feature | Status |
|---|---|
| Signup / Login (email+password) | ✅ Working — JWT issued, bcrypt-hashed passwords |
| Forgot password | ⚠️ Endpoint exists, returns 202, but **does not send an email yet** (no SMTP wired in) |
| Google Sign-In | ⚠️ Button exists, redirects to backend, backend returns 501 until `GOOGLE_CLIENT_ID`/`SECRET` are set and OAuth flow is implemented |
| Business onboarding, dashboard, invoices, etc. | 🔜 Not built yet — next pages in the queue |

## Known simplification to revisit
`businesses` currently maps 1:1 to a single owner user. Accountant/Staff roles collaborating on the *same* business will need a `business_members` join table — this is called out in `database/schema.sql` and will be added when the Team/Settings page is built, not assumed now.

## Roadmap (build order — confirm before I continue)
1. ~~Login~~ ✅ (this commit)
2. Signup page
3. Forgot Password page
4. Business Onboarding (post-first-login)
5. Dashboard shell + sidebar
6. Invoices module
7. Expenses module
8. GST Center (calculation engine)
9. Reports + export
10. AI Insights (rule-based, clearly labeled — not real ML)
11. Settings / Profile / Notifications
