# Docker

Dev environment runs the full stack:

- frontend: React/Vite on `http://localhost:5173`
- backend: FastAPI on `http://localhost:8000/api`
- worker: schedule generation RQ worker
- postgres: application database
- redis: RQ queue

## Start

```bash
docker compose up --build
```

## Stop

```bash
docker compose down
```

## Reset Local Docker Database

```bash
docker compose down -v
```

## Logs

```bash
docker compose logs -f backend
docker compose logs -f worker
docker compose logs -f frontend
```

The backend applies Alembic migrations on startup and seeds reference data into
the `reference_datasets` table when it is empty.
