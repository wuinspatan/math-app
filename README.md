# MathApp

A production-ready full-stack math web application built with **Next.js + FastAPI**, deployable on **Vercel + Railway/Render**, with a **Nix Flake** development environment.

---

## Features

| Tab | What it does |
|-----|-------------|
| **Number Converter** | Real-time Decimal ↔ Binary ↔ Octal ↔ Hex conversion |
| **Matrix Calculator** | NxN grid UI, Add / Subtract / Multiply |
| **Advanced Math** | Laplace transform with step-by-step beginner explanation |

---

## Project Structure

```
mathapp/
├── flake.nix                  ← Nix dev environment (Python + Node)
├── scripts/
│   ├── dev-backend.sh         ← Run FastAPI locally
│   └── dev-frontend.sh        ← Run Next.js locally
│
├── backend/                   ← FastAPI Python API
│   ├── main.py                ← App entry point, CORS config
│   ├── requirements.txt
│   ├── Procfile               ← For Railway / Render
│   ├── railway.toml           ← Railway deploy config
│   ├── render.yaml            ← Render deploy config (alternative)
│   ├── .env.example
│   ├── core/
│   │   ├── converters.py      ← Base conversion logic
│   │   ├── matrix.py          ← Matrix math (add/sub/mul)
│   │   └── laplace.py         ← SymPy Laplace + step explanations
│   └── routers/
│       ├── converters.py      ← POST /convert
│       ├── matrix.py          ← POST /matrix/{add,subtract,multiply}
│       └── laplace.py         ← POST /laplace
│
└── frontend/                  ← Next.js 14 (App Router) + Tailwind
    ├── next.config.js
    ├── tailwind.config.ts
    ├── vercel.json
    ├── .env.local.example
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx       ← Main page with tab navigation
        │   └── globals.css
        ├── components/
        │   ├── ui/
        │   │   ├── Button.tsx
        │   │   ├── Card.tsx
        │   │   └── ErrorMessage.tsx
        │   └── features/
        │       ├── Converter.tsx   ← Number converter UI
        │       ├── Matrix.tsx      ← Matrix grid calculator UI
        │       └── Laplace.tsx     ← Laplace transform + steps UI
        └── lib/
            └── api.ts         ← All fetch() calls to backend
```

---

## Local Development (with Nix)

### Prerequisites
- [Nix](https://nixos.org/download) with flakes enabled
- That's it — Nix handles Python and Node for you!

### Step 1 – Enter the dev shell
```bash
cd mathapp
nix develop
# This auto-creates backend/.venv and installs all deps
```

### Step 2 – Start the backend (Terminal 1)
```bash
./scripts/dev-backend.sh
# FastAPI runs on http://localhost:8000
# Interactive docs: http://localhost:8000/docs
```

### Step 3 – Start the frontend (Terminal 2)
```bash
./scripts/dev-frontend.sh
# Next.js runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Local Development (without Nix)

### Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create your .env file
cp .env.example .env

uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated allowed CORS origins |
| `PORT` | `8000` | Port (set automatically by Railway/Render) |

### Frontend (`frontend/.env.local`)
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of your FastAPI backend |

---

## API Reference

### `POST /convert`
Convert a number from any base to all four representations.
```json
// Request
{ "value": "FF", "from_base": "hex" }

// Response
{ "decimal": "255", "binary": "11111111", "octal": "377", "hex": "FF" }
```

### `POST /matrix/add`  |  `POST /matrix/subtract`  |  `POST /matrix/multiply`
```json
// Request
{ "a": [[1,2],[3,4]], "b": [[5,6],[7,8]] }

// Response
{ "result": [[6,8],[10,12]] }
```

### `POST /laplace`
```json
// Request
{ "expression": "t**2" }

// Response
{
  "input": "t**2",
  "result": "2/s**3",
  "result_latex": "\\frac{2}{s^{3}}",
  "steps": ["Step 1: We want to find...", "Step 2: The Laplace transform is defined as...", ...],
  "transform_table": [["constant", "c", "c/s"], ...]
}
```

---

## Deployment

### Deploy Backend → Railway

1. Create a free account at [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repo, set the **root directory** to `backend`
4. Railway auto-detects Python. It uses `railway.toml` for config.
5. Go to **Variables** tab and add:
   ```
   ALLOWED_ORIGINS = https://your-app.vercel.app
   ```
6. Copy the generated URL (e.g. `https://mathapp-api.railway.app`)

> **Alternative: Render**
> 1. Go to [render.com](https://render.com) → New → Web Service
> 2. Connect repo, set root to `backend`
> 3. Build command: `pip install -r requirements.txt`
> 4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
> 5. Add env var `ALLOWED_ORIGINS` in the dashboard

---

### Deploy Frontend → Vercel

1. Create a free account at [vercel.com](https://vercel.com)
2. Click **"Add New Project"** → import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Under **Environment Variables**, add:
   ```
   NEXT_PUBLIC_API_URL = https://mathapp-api.railway.app
   ```
   (use the Railway URL from the previous step)
5. Click **Deploy**

---

### After Deployment – Update CORS

Go back to Railway/Render and update `ALLOWED_ORIGINS` to match your real Vercel URL:
```
ALLOWED_ORIGINS = https://mathapp.vercel.app
```

---

## Production Testing Guide

### 1. Test the backend directly
```bash
# Health check
curl https://your-api.railway.app/

# Convert
curl -X POST https://your-api.railway.app/convert \
  -H "Content-Type: application/json" \
  -d '{"value":"255","from_base":"decimal"}'

# Matrix multiply
curl -X POST https://your-api.railway.app/matrix/multiply \
  -H "Content-Type: application/json" \
  -d '{"a":[[1,2],[3,4]],"b":[[5,6],[7,8]]}'

# Laplace
curl -X POST https://your-api.railway.app/laplace \
  -H "Content-Type: application/json" \
  -d '{"expression":"t**2"}'
```

### 2. Check the interactive API docs
Visit `https://your-api.railway.app/docs` — FastAPI auto-generates a Swagger UI where you can test every endpoint interactively.

### 3. Test the frontend
- Open your Vercel URL
- Try converting `255` from decimal → check all four outputs
- Build a 2×2 matrix and test add / multiply
- Enter `sin(2*t)` in Laplace and read the step-by-step

### 4. Check CORS is working
Open browser DevTools → Network tab → confirm no CORS errors when the frontend calls the backend.

---

## Tech Stack Summary

| Layer | Tech | Why |
|-------|------|-----|
| Frontend | Next.js 14 (App Router) | React framework, easy Vercel deploy |
| Styling | TailwindCSS | Utility-first, dark mode, responsive |
| Backend | FastAPI + Python | Fast, async, auto docs, type-safe |
| Math | SymPy | Symbolic computation for Laplace |
| Dev env | Nix Flake | Reproducible, no version conflicts |
| Frontend deploy | Vercel | Zero-config Next.js hosting |
| Backend deploy | Railway / Render | Simple Python hosting with env vars |
