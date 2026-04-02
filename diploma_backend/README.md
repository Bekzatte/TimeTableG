# Backend for Bekzatte/DIPLOMA front part

This backend matches the frontend structure from the GitHub repository `Bekzatte/DIPLOMA`.
The frontend currently uses mock APIs in `src/services/api.js`, and this backend provides real endpoints with the same CRUD shape plus a `generate schedule` endpoint.

## What is included

- FastAPI backend
- SQLite database
- CRUD for:
  - `/api/courses`
  - `/api/teachers`
  - `/api/rooms`
  - `/api/schedules`
- Schedule generation endpoint:
  - `POST /api/schedules/generate`
- CORS enabled for Vite frontend (`localhost:5173`)
- Seed data similar to the current frontend mock structure

## Project structure

```text
app/
  main.py
  database.py
  models.py
  schemas.py
  crud.py
  seed.py
  routers/
    courses.py
    teachers.py
    rooms.py
    schedules.py
  services/
    schedule_generator.py
requirements.txt
```

## How to run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will start on:

```text
http://localhost:8000
```

Swagger docs:

```text
http://localhost:8000/docs
```

## How to connect the frontend

Replace `src/services/api.js` with something like this:

```javascript
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const unwrap = async (promise) => {
  const response = await promise;
  return response.data;
};

export const courseAPI = {
  getAll: () => unwrap(api.get("/courses")),
  create: (data) => unwrap(api.post("/courses", data)),
  update: (id, data) => unwrap(api.put(`/courses/${id}`, data)),
  delete: (id) => unwrap(api.delete(`/courses/${id}`)),
};

export const teacherAPI = {
  getAll: () => unwrap(api.get("/teachers")),
  create: (data) => unwrap(api.post("/teachers", data)),
  update: (id, data) => unwrap(api.put(`/teachers/${id}`, data)),
  delete: (id) => unwrap(api.delete(`/teachers/${id}`)),
};

export const roomAPI = {
  getAll: () => unwrap(api.get("/rooms")),
  create: (data) => unwrap(api.post("/rooms", data)),
  update: (id, data) => unwrap(api.put(`/rooms/${id}`, data)),
  delete: (id) => unwrap(api.delete(`/rooms/${id}`)),
};

export const scheduleAPI = {
  getAll: () => unwrap(api.get("/schedules")),
  create: (data) => unwrap(api.post("/schedules", data)),
  update: (id, data) => unwrap(api.put(`/schedules/${id}`, data)),
  delete: (id) => unwrap(api.delete(`/schedules/${id}`)),
  generate: (data) => unwrap(api.post("/schedules/generate", data)),
};

export default {
  courseAPI,
  teacherAPI,
  roomAPI,
  scheduleAPI,
};
```

## Notes

- The schedule page sends `{ semester, year, algorithm }` and expects an array back from `scheduleAPI.generate(...)`.
- The timetable grid expects schedule items with fields like `day`, `start_hour`, `course_name`, `teacher_name`, and `room_number`.
- The current generator is a lightweight deterministic allocator, not a full OR-Tools optimizer yet.

## Stronger diploma next step

Replace `app/services/schedule_generator.py` with your OR-Tools CP-SAT generator and keep the same API contract. Then the frontend will not need to change.
