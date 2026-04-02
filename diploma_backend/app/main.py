from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .routers import courses, rooms, schedules, teachers
from .seed import seed_data

app = FastAPI(
    title="DIPLOMA Timetable Backend",
    version="1.0.0",
    description="Backend for the timetable optimization frontend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
with SessionLocal() as db:
    seed_data(db)

app.include_router(courses.router, prefix="/api")
app.include_router(teachers.router, prefix="/api")
app.include_router(rooms.router, prefix="/api")
app.include_router(schedules.router, prefix="/api")


@app.get("/")
def root():
    return {
        "message": "DIPLOMA timetable backend is running",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
