# ResQNet — AI Disaster Response System

ResQNet is a full-stack, AI-powered disaster response coordination platform.
Report an emergency and a six-agent LangGraph pipeline — running on Groq's
`openai/gpt-oss-120b` — analyzes the disaster, recommends the nearest
capable hospital, assembles a rescue plan, allocates relief resources, and
drafts a communication report, all within seconds.

Built as a final-year B.Tech project demonstration.

---

## 1. Project Overview

When a disaster is reported through the ResQNet dashboard, the request is
handed to a **Supervisor Agent**, which gathers reference data (hospitals,
rescue teams, shelters, relief stock) and passes it down a chain of five
specialist agents. Each agent reasons over the situation with the LLM and
updates a shared workflow state:

```
Supervisor Agent
   └─▶ Disaster Analysis Agent      (risk level, key risks, priorities)
        └─▶ Hospital Recommendation Agent   (best-fit hospitals)
             └─▶ Rescue Planning Agent       (teams, strategy, equipment)
                  └─▶ Relief Resource Agent  (water/food/shelter allocation)
                       └─▶ Communication Agent  (public alert + briefing)
```

The final report — plus a full execution log of every agent's decision — is
persisted to SQLite and instantly available on the dashboard, in history, and
on a dedicated details page.

---

## 2. Architecture

```
┌─────────────────┐        REST (JSON)        ┌──────────────────────┐
│   React + Vite   │ ────────────────────────▶ │   FastAPI Backend     │
│  Tailwind CSS    │ ◀──────────────────────── │                        │
│  Leaflet / Charts │                           │  ┌──────────────────┐ │
└─────────────────┘                            │  │ LangGraph Agents │ │
                                                 │  │ (Groq LLM)       │ │
                                                 │  └──────────────────┘ │
                                                 │  SQLite via SQLAlchemy│
                                                 │  CSV reference data   │
                                                 └──────────────────────┘
```

- **Frontend** talks to the backend purely over HTTP/JSON via Axios.
- **Backend** exposes a REST API, runs the LangGraph workflow synchronously
  per request, and persists results.
- **Datasets** (hospitals, rescue teams, relief resources, shelters) are
  plain CSV files the Supervisor Agent reads to ground the AI's
  recommendations in real reference data instead of hallucinating names.

---

## 3. Tech Stack

**Frontend:** React 19 · Vite · Tailwind CSS v4 · React Router DOM · Axios ·
React Icons · Recharts · React Leaflet

**Backend:** Python 3.11 · FastAPI · Pydantic · SQLAlchemy · SQLite

**AI:** LangGraph · LangChain · Groq API · `openai/gpt-oss-120b`

---

## 4. Folder Structure

```
ResQNet/
├── backend/
│   ├── api/                  # Route handlers
│   │   ├── emergency_routes.py
│   │   └── stats_routes.py
│   ├── agents/                # LangGraph workflow + individual agents
│   │   ├── state.py
│   │   ├── supervisor_agent.py
│   │   ├── disaster_analysis_agent.py
│   │   ├── hospital_agent.py
│   │   ├── rescue_agent.py
│   │   ├── relief_agent.py
│   │   ├── communication_agent.py
│   │   └── graph.py
│   ├── database/              # SQLAlchemy models + session
│   │   ├── db.py
│   │   └── models.py
│   ├── schemas/                # Pydantic request/response schemas
│   │   └── emergency.py
│   ├── services/                # Business logic
│   │   ├── llm_service.py
│   │   ├── dataset_service.py
│   │   └── emergency_service.py
│   ├── config/
│   │   └── settings.py
│   ├── utils/
│   │   └── severity.py         # Shared severity colors/badges (Streamlit UI)
│   ├── datasets/                # CSV reference data
│   │   ├── hospitals.csv
│   │   ├── rescue_teams.csv
│   │   ├── relief_resources.csv
│   │   └── shelters.csv
│   ├── main.py                  # FastAPI entry point
│   ├── streamlit_app.py         # Streamlit edition — single-app alternative
│   ├── requirements.txt
│   ├── Procfile                 # Render/Railway start command
│   ├── runtime.txt              # Python version pin for Render
│   ├── run.bat                  # Windows one-click backend launcher
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Navbar, Footer, cards, form, map, etc.
│   │   ├── pages/              # Dashboard, History, EmergencyDetails, 404
│   │   ├── services/            # Axios API client
│   │   ├── context/              # Dark mode ThemeContext
│   │   ├── utils/                 # Shared helpers (severity styles, dates)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── _redirects           # Netlify SPA routing rule
│   ├── index.html
│   ├── package.json
│   ├── vercel.json               # Vercel SPA routing rule
│   ├── run.bat                    # Windows one-click frontend launcher
│   └── .env.example
│
├── .streamlit/
│   ├── config.toml               # Streamlit theme (dark blue, matches React UI)
│   └── secrets.toml.example      # Template for local Streamlit secrets
│
├── start.bat                     # Windows one-click launcher (backend + frontend)
├── requirements.txt              # Mirrors backend/requirements.txt
├── .env.example                  # Mirrors backend/.env.example
└── README.md
```

---

## 5. Installation

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- A free Groq API key: https://console.groq.com/keys

### Backend Setup

```bash
cd ResQNet/backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Open `backend/.env` and paste your Groq API key:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend Setup

```bash
cd ResQNet/frontend
npm install
cp .env.example .env
```

The default `VITE_API_URL=http://localhost:8000` works out of the box for
local development.

---

## 6. Environment Variables

**backend/.env**

| Variable          | Description                                   | Default                          |
|-------------------|------------------------------------------------|-----------------------------------|
| `GROQ_API_KEY`    | Your Groq API key                              | *(required)*                      |
| `GROQ_MODEL`      | Model used by all agents                       | `openai/gpt-oss-120b`         |
| `DATABASE_URL`    | SQLAlchemy database URL                        | `sqlite:///./resqnet.db`          |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins                   | `http://localhost:5173,...`       |

**frontend/.env**

| Variable       | Description               | Default                  |
|----------------|----------------------------|---------------------------|
| `VITE_API_URL` | Backend base URL           | `http://localhost:8000`   |

---

## 7. How to Run

### Quick start (after you've done the one-time setup in section 5)

Just double-click **`start.bat`** in the project root. It opens two terminal
windows — one running the backend on `http://localhost:8000`, one running the
frontend on `http://localhost:5173` — and prints both URLs. Close the windows
to stop the servers. Then open `http://localhost:5173` in your browser.

(`backend\run.bat` and `frontend\run.bat` also exist if you ever want to start
just one side on its own.)

### Manual start (equivalent, for reference)

Open two terminals.

**Terminal 1 — Backend**
```bash
cd ResQNet/backend
source venv/bin/activate        # if not already active
uvicorn main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`. Interactive API docs are available
at `http://localhost:8000/docs`.

**Terminal 2 — Frontend**
```bash
cd ResQNet/frontend
npm run dev
```
Frontend runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser and submit an emergency to see
the full AI agent pipeline run live.

---

## 8. API Endpoints

| Method   | Endpoint                | Description                                      |
|----------|--------------------------|---------------------------------------------------|
| `POST`   | `/emergency`             | Submit a new emergency; runs the full AI workflow |
| `GET`    | `/history`                | Paginated list of past emergencies                |
| `GET`    | `/emergency/{id}`         | Full stored report for one emergency               |
| `DELETE` | `/emergency/{id}`         | Delete a stored emergency report                    |
| `GET`    | `/stats`                   | Dashboard statistics (totals, by-type, by-severity, 7-day timeline) |
| `GET`    | `/map-data`                | Location data for the live situation map            |
| `GET`    | `/health`                   | Health check                                          |

Full interactive documentation (Swagger UI) is auto-generated by FastAPI at
`/docs` once the backend is running.

---

## 9. Screenshots

> _Add screenshots of the Dashboard, Emergency Form results, History page,
> and Details page here once you've run the app locally._

`docs/screenshots/dashboard.png`
`docs/screenshots/ai-response.png`
`docs/screenshots/history.png`

---

## 10. Deployment (Vercel + Render)

Streamlit Cloud isn't a fit here — it only hosts a single Python app, and this
project is a separate React frontend + FastAPI backend. Instead, deploy the
backend on **Render** and the frontend on **Vercel** (Netlify works too — a
`public/_redirects` file is already included for that).

### 10.1 Backend on Render

1. Push this project to a GitHub repo.
2. On [render.com](https://render.com), **New → Web Service**, connect the repo.
3. Set:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3 (picks up `runtime.txt` automatically)
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
     (Render also auto-detects the included `Procfile`, so this is set either way.)
4. Add environment variables (Render dashboard → Environment):
   - `GROQ_API_KEY` — your key
   - `GROQ_MODEL` — `openai/gpt-oss-120b`
   - `ALLOWED_ORIGINS` — your Vercel URL once you have it, e.g. `https://resqnet.vercel.app`
   - `DATABASE_URL` — leave unset to use SQLite, **or** point it at a Postgres
     instance (see caveat below)
5. Deploy. Note the URL Render gives you, e.g. `https://resqnet-backend.onrender.com`.

**Caveat — SQLite on Render's free tier:** the free plan's disk is ephemeral,
so the `resqnet.db` file can be wiped on redeploy or after the service spins
down from inactivity. Fine for a demo; for anything longer-lived, create a
free Postgres database (Render's own, or [Neon](https://neon.tech)/[Supabase](https://supabase.com))
and set `DATABASE_URL=postgresql://user:pass@host/dbname` — the driver
(`psycopg2-binary`) is already in `requirements.txt`, no code changes needed.

### 10.2 Frontend on Vercel

1. On [vercel.com](https://vercel.com), **Add New → Project**, import the same repo.
2. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variable:
   - `VITE_API_URL` — your Render backend URL from step 10.1, e.g.
     `https://resqnet-backend.onrender.com`
4. Deploy. The included `vercel.json` handles client-side routing so
   `/history` and `/emergency/:id` work on direct load and refresh, not just
   in-app navigation.
5. Once deployed, go back to Render and update `ALLOWED_ORIGINS` to your real
   Vercel URL, then redeploy the backend so CORS allows it.

### 10.3 Netlify (alternative to Vercel)

Same idea: root directory `frontend`, build command `npm run build`, publish
directory `dist`, and set `VITE_API_URL` under Site settings → Environment
variables. The `public/_redirects` file already handles SPA routing.

### 10.4 Streamlit Community Cloud (alternative single-app deployment)

Streamlit Cloud only hosts one Python app — it can't run the React frontend
and FastAPI backend as two separate services. For that reason, a second,
self-contained UI is included: `backend/streamlit_app.py`. It calls the same
LangGraph agent workflow and SQLite database directly (no HTTP hop to
FastAPI), so it's a single deployable app with the same Report Emergency /
Dashboard / History functionality.

1. Push this project to a GitHub repo.
2. On [share.streamlit.io](https://share.streamlit.io), **New app**, connect
   the repo, and set:
   - **Main file path:** `backend/streamlit_app.py`
3. Under **Advanced settings → Secrets**, paste:
   ```toml
   GROQ_API_KEY = "your_groq_api_key_here"
   GROQ_MODEL = "openai/gpt-oss-120b"
   ```
4. Deploy. Streamlit installs everything listed in `backend/requirements.txt`
   automatically (it already includes `streamlit` and `plotly`).

To run this version locally first:
```bash
cd backend
# after the venv + pip install steps from section 5
copy .streamlit\secrets.toml.example .streamlit\secrets.toml   # Windows
# cp .streamlit/secrets.toml.example .streamlit/secrets.toml   # macOS/Linux
```
Edit `.streamlit/secrets.toml` with your real key, then:
```bash
streamlit run streamlit_app.py
```
Opens at `http://localhost:8501`. `.streamlit/config.toml` at the project
root already sets a dark blue theme to match the React app.

**Note:** this is a second, independent frontend — it doesn't require the
React app or FastAPI's `main.py` to be running. Pick whichever deployment
path (React+FastAPI on Vercel/Render, or this Streamlit app) fits your
demo; both read/write the same `backend/services` and `backend/agents` code
and the same `resqnet.db` file when run locally.

---

## 11. Future Scope

- Real-time push notifications to rescue teams via WebSockets
- SMS/WhatsApp alerts to affected contacts using the Communication Agent's output
- Multi-language support for public alerts
- Role-based authentication for dispatchers vs. field responders
- Live GPS tracking of rescue vehicles on the map
- Predictive disaster-risk modeling using historical weather/seismic data
- Offline-first PWA support for low-connectivity disaster zones

---

## License

MIT — see `LICENSE`.
