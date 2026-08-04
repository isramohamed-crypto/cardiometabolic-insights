"""
Vitalist -- FastAPI backend

Serves the built React/Vite client (see ../client) as static files and
exposes the habit/tracking/content API, ported 1:1 from the original
Node/Express server (../server/src). All data is in-memory placeholders --
swap in a real database when ready, same as the original noted.

Deploy shape (BrightInsight C2P convention): this file plus
requirements.txt live in app/backend/; the built client/dist/ output is
copied into ./static at container-build time.
"""
import time
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.middleware.base import BaseHTTPMiddleware

app = FastAPI(title="Vitalist", docs_url="/api/docs", redoc_url=None)


class NoCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-cache"
        return response


app.add_middleware(NoCacheMiddleware)


@app.get("/health")
async def health():
    """Cloud Run readiness probe."""
    return {"ok": True, "service": "vitalist"}


@app.get("/api/health")
async def api_health():
    """Matches the original Express GET /api/health response shape."""
    return {"status": "ok"}


# -- Habits -------------------------------------------------------------
# Ported from server/src/routes/habits.js -- same in-memory placeholder store.
habits = [
    {"id": 1, "name": "Morning walk", "frequency": "daily", "streak": 0},
    {"id": 2, "name": "Strength training", "frequency": "3x/week", "streak": 0},
]


class HabitIn(BaseModel):
    name: str
    frequency: Optional[str] = None


@app.get("/api/habits")
async def list_habits():
    return habits


@app.post("/api/habits", status_code=201)
async def create_habit(habit: HabitIn):
    new_habit = {"id": int(time.time() * 1000), "streak": 0, **habit.model_dump(exclude_none=True)}
    habits.append(new_habit)
    return new_habit


@app.post("/api/habits/{habit_id}/complete")
async def complete_habit(habit_id: int):
    habit = next((h for h in habits if h["id"] == habit_id), None)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    habit["streak"] += 1
    return habit


# -- Tracking -------------------------------------------------------------
# Ported from server/src/routes/tracking.js.
entries: list[dict] = []


class TrackingIn(BaseModel):
    metric: str
    value: float
    unit: Optional[str] = None
    recordedAt: Optional[str] = None


@app.get("/api/tracking")
async def list_tracking():
    return entries


@app.post("/api/tracking", status_code=201)
async def create_tracking(entry: TrackingIn):
    new_entry = {
        "id": int(time.time() * 1000),
        "metric": entry.metric,
        "value": entry.value,
        "unit": entry.unit,
        "recordedAt": entry.recordedAt or datetime.now(timezone.utc).isoformat(),
    }
    entries.append(new_entry)
    return new_entry


# -- Content -------------------------------------------------------------
# Ported from server/src/routes/content.js -- placeholder for the real
# People Inc. longevity/wellness content feed integration.
sample_content = [
    {
        "id": 1,
        "title": "The science of Zone 2 cardio for longevity",
        "source": "People Inc.",
        "url": None,
    },
    {
        "id": 2,
        "title": "How sleep quality affects healthspan",
        "source": "People Inc.",
        "url": None,
    },
]


@app.get("/api/content")
async def get_content():
    return sample_content


# -- Static SPA -------------------------------------------------------------
# Mounted last so /api/* and /health take precedence over the SPA catch-all.
app.mount("/", StaticFiles(directory="static", html=True), name="static")
