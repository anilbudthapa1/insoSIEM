# Deployment Guide

This guide describes the current supported deployment path for the Inso SIEM sellable-MVP track.

## Prerequisites

- Docker Engine with Compose v2.
- A Linux host with enough memory for PostgreSQL, Redis, ClickHouse, NATS, MinIO, backend, frontend, and Nginx.
- DNS and TLS certificates for the public app URL before production exposure.
- Strong random secrets for PostgreSQL, Redis, NATS, MinIO, JWT signing, and secret encryption.

## Environment Setup

Copy `.env.example` to `.env` and replace every `changeme_*`, `REPLACE_WITH_*`, local-only hostname, and example domain before starting the stack.

Important production values include:

- `APP_ENV=production`
- `APP_URL`
- `HTTP_PORT`
- `HTTPS_PORT`
- `POSTGRES_PASSWORD`
- `CLICKHOUSE_PASSWORD`
- `REDIS_PASSWORD`
- `NATS_PASSWORD`
- `MINIO_ROOT_PASSWORD`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM=HS256`
- `ENCRYPTION_KEY`
- `VITE_API_BASE_URL`
- `VITE_WS_URL`

The backend accepts the legacy names used in `.env.example` for key settings, including `APP_ENV`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`, `JWT_REFRESH_TOKEN_EXPIRE_DAYS`, `ENCRYPTION_KEY`, `CLICKHOUSE_PASSWORD`, `MINIO_USE_SSL`, `OLLAMA_BASE_URL`, `SMTP_PASSWORD`, and `RATE_LIMIT_AUTH_RPM`.

## Start The Stack

```bash
docker compose up --build -d
```

Check service health:

```bash
docker compose ps
docker compose logs --tail=100 backend
```

## Database Bootstrap And Migrations

Fresh Docker volumes are initialized from `infra/postgres/init.sql` and `infra/clickhouse/init.sql`.

Existing PostgreSQL databases should be upgraded with Alembic:

```bash
make migrate
```

The current Alembic scaffold lives under `backend/alembic/`. The first checked-in migration creates `audit_logs` idempotently for existing databases and is aligned with the bootstrap SQL.

## Validation

Run these before promotion:

```bash
python3 -m compileall backend/app backend/alembic backend/tests
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q
cd frontend && npm run build
docker compose config --quiet
```

Expected current status:

- Backend tests pass.
- Frontend build passes with the known Vite large-chunk warning.
- Docker Compose config validates.

## Operational Notes

- Do not expose PostgreSQL, Redis, NATS, ClickHouse, or MinIO directly to the public internet.
- Run `make migrate` as a deployment step for existing databases.
- Rotate all bootstrap/default credentials before production.
- Treat AI provider keys as production secrets and store them outside source control.
- Keep audit logs immutable from the application UI. Admins can read and export audit logs, but deletion should remain a database retention operation.

## Rollback

For application-only rollback, deploy the previous backend/frontend images and leave data volumes intact. For database rollback, use Alembic downgrade only after verifying the target migration is data-safe. Do not drop `audit_logs` in production unless an approved retention or disaster-recovery procedure requires it.
