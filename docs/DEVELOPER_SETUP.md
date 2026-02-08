# F1 Intelligence Platform - Developer Setup Guide

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/JeetShah-10/f1-race-intelligence-system.git
cd f1-race-intelligence-system
git checkout frontend-core

# Install frontend dependencies
cd frontend
npm install
```

### 2. Environment Setup

Create `frontend/.env.local` with the following variables:

```env
VITE_SUPABASE_URL=https://jmllcxhzdusnhjxysilf.supabase.co
VITE_SUPABASE_ANON_KEY=<ask-project-owner-for-key>
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Get the Supabase Anon Key from the project owner (Jeet Shah)**

### 3. Run Development Server

```bash
npm run dev
```

App will be available at `http://localhost:5173`

---

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabase.ts       # Supabase client initialization
│   ├── services/
│   │   └── auth.ts           # Authentication service (login, signup, OAuth)
│   ├── pages/
│   │   ├── LoginPage.tsx     # Login UI with email/password + OAuth
│   │   └── SignupPage.tsx    # Signup UI with email/password + OAuth
│   └── store/
│       └── useAppStore.ts    # Zustand state management
└── .env.local                # Environment variables (create this!)
```

---

## Authentication Features

| Feature | Status | Notes |
|---------|--------|-------|
| Email/Password Login | ✅ Working | Uses Supabase Auth |
| Email/Password Signup | ✅ Working | Email verification enabled |
| Google OAuth | 🔧 Pending | Needs Google Cloud setup |
| GitHub OAuth | 🔧 Pending | Needs GitHub OAuth app |
| Session Management | ✅ Working | JWT with auto-refresh |

---

## Database Security (RLS)

All tables have Row Level Security enabled:

| Table | Read | Write |
|-------|------|-------|
| drivers, circuits, teams, etc. | ✅ Public | ❌ Backend only |
| simulation_results | ✅ Public | ✅ Authenticated users |

---

## Backend Developer Notes

The backend should:

1. Use the **service_role** key (not anon key) for database writes
2. Implement API endpoints at `http://localhost:8000`
3. The frontend expects these endpoints:
   - `GET /api/drivers` - List drivers
   - `GET /api/circuits` - List circuits
   - `GET /api/standings` - Get standings
   - `POST /api/simulate` - Run simulation
   - `POST /api/predict` - Get predictions

---

## Troubleshooting

### "Missing Supabase credentials"
- Make sure `frontend/.env.local` exists with correct values
- Restart the dev server after creating/modifying `.env.local`

### Auth not working
- Check browser console for errors
- Verify Supabase URL and anon key are correct
- Check Supabase Dashboard → Auth → Users to see if user was created
