# Test Results

## 2026-04-21 Cycle 1 and 2 Validation

- Backend compile: passed with `python3 -m compileall backend/app`.
- Backend tests: passed with `PYTHONPATH=backend pytest backend/tests -q` (`2 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports an existing large chunk warning.
- Docker Compose config: passed with `docker compose config --quiet`.
- Route registration check: passed; FastAPI route count is `220`, including `/api/v1/auth/register` and `/api/v1/ingest/health`.

## 2026-04-21 Cycle 3 Validation

- Detection YAML/JSON validation: passed for files under `detections/rules/` and `detections/test_samples/`.
- Backend compile: passed with `python3 -m compileall backend/app`.
- Backend tests: passed with `PYTHONPATH=backend pytest backend/tests -q` (`2 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.

## 2026-04-22 Cycle 4 Validation

- Backend compile: passed with `python3 -m compileall backend/app`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`3 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.
- Note: running pytest without the repo virtualenv used incompatible system FastAPI/Pydantic packages and failed during collection. Use the venv-backed command above.

## 2026-04-22 Cycle 5A Validation

- Backend compile: passed with `python3 -m compileall backend/app`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`4 passed`, existing dependency warnings only).

## 2026-04-22 Cycle 5B Validation

- Backend compile: passed with `python3 -m compileall backend/app backend/alembic`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`4 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.
- Alembic scaffold check: passed with `PYTHONPATH=. ../.venv/bin/alembic -c alembic.ini history` from `backend/`.

## 2026-04-22 Cycle 5C Validation

- Backend compile: passed with `python3 -m compileall backend/app backend/tests`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`8 passed`, existing dependency warnings only).

## 2026-04-22 Cycle 5D Validation

- Backend compile: passed with `python3 -m compileall backend/app backend/tests`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`9 passed`, existing dependency warnings only).

## 2026-04-22 Cycle 6B Validation

- Backend compile: passed with `python3 -m compileall backend/app backend/tests`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`10 passed`, existing dependency warnings only).

## 2026-04-22 Cycle 6C Validation

- Backend compile: passed with `python3 -m compileall backend/app backend/tests`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`10 passed`, existing dependency warnings only).

## 2026-04-22 Final Validation Pass

- Docker Compose config: passed with `docker compose config --quiet`.
- Backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`10 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.

## 2026-04-22 Cycle 7A Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_parsing_ingestion_capabilities.py -q` (`8 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`14 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `106 Implemented + 14 Partial = 120/500 = 24.0%`.

## 2026-04-22 Cycle 7B Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_context_storage_search_capabilities.py -q` (`7 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`17 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `131 Implemented + 39 Partial = 170/500 = 34.0%`.

## 2026-04-22 Cycle 7C Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_detection_alert_export_capabilities.py -q` (`7 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`20 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `156 Implemented + 64 Partial = 220/500 = 44.0%`.

## 2026-04-22 Cycle 7D Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_ai_incident_workflow_capabilities.py -q` (`7 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`23 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `178 Implemented + 92 Partial = 270/500 = 54.0%`.

## 2026-04-22 Cycle 7E Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_threat_soar_asset_capabilities.py -q` (`7 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`26 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `193 Implemented + 127 Partial = 320/500 = 64.0%`.

## 2026-04-22 Cycle 7F Validation

- Backend compile: passed with `PYTHONPATH=backend .venv/bin/python -m compileall backend/app backend/tests`.
- Focused backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests/test_app_contract.py backend/tests/test_asset_identity_analytics_capabilities.py -q` (`7 passed`, existing dependency warnings only).
- Full backend tests: passed with `PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q` (`29 passed`, existing dependency warnings only).
- App-guide module coverage calculation: passed at `200 Implemented + 170 Partial = 370/500 = 74.0%`.

## 2026-04-22 Cycle 7G Validation

- Backend compile: passed with `cd backend && ../.venv/bin/python -m compileall app tests`.
- Focused backend tests: passed with `cd backend && ../.venv/bin/python -m pytest tests/test_cloud_vulnerability_compliance_capabilities.py` (`5 passed`, existing dependency warnings only).
- Full backend tests: passed with `cd backend && ../.venv/bin/python -m pytest tests/` (`34 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.
- App factory route registration: passed; `create_app()` exposes 459 unique paths including cloud-security, vulnerabilities, and compliance capabilities.
- App-guide module coverage calculation: passed at `200 Implemented + 220 Partial = 420/500 = 84.0%`.
- Note: direct `../.venv/bin/pytest ...` still drops the backend package path in this environment; use `../.venv/bin/python -m pytest ...` from `backend/`.

## 2026-04-22 Cycle 7H Validation

- Backend compile: passed with `cd backend && ../.venv/bin/python -m compileall app tests`.
- Focused backend tests: passed with `cd backend && ../.venv/bin/python -m pytest tests/test_final_platform_coverage.py -q` (`6 passed`, existing dependency warnings only).
- Full backend tests: passed with `cd backend && ../.venv/bin/python -m pytest tests/ -q` (`40 passed`, existing dependency warnings only).
- Frontend build: passed with `npm run build`; Vite reports the existing large chunk warning.
- App factory route registration: passed; `create_app()` exposes 542 unique paths including auth password reset, SOC operations, validation, system-admin, and developer ecosystem capabilities.
- App-guide module coverage calculation: passed at `204 Implemented + 296 Partial = 500/500 = 100.0%`.

## 2026-04-22 Cycle 7I Documentation Validation

- README line count check: passed at `437 README.md`.
- Stale endpoint check: passed; no `/api/v1/ingestion` reference remains in `README.md`.
- ASCII check: passed; no non-ASCII characters were found in `README.md`.
- Referenced project file check: passed for key docs, `.agent_control` files, SQL bootstrap files, demo data, `.env.example`, and `docker-compose.yml`.
- Git status check: blocked because `/home/inso/Downloads/SEIM/inso` is not a git repository.
- Backend/frontend tests were not rerun for this documentation-only update; use the Cycle 7H full validation as the latest code validation baseline.

## 2026-04-22 Cycle 7J Environment Setup Validation

- JWT setup reference check: passed; `.env.example`, `README.md`, and `docs/deployment_guide.md` now recommend `JWT_ALGORITHM=HS256`.
- RS256 path check: passed; RS256 key-path values are commented as reserved for future support in `.env.example`.
- Backend/frontend tests were not rerun for this documentation and environment-template update.

## 2026-04-22 Cycle 7K Local Docker Validation

- Docker Compose config validation: passed with `docker compose config --quiet`.
- Docker stack start: passed with `docker compose up -d --build`.
- Backend health: passed; `inso-backend` reports healthy.
- Frontend health: passed; `inso-frontend` reports healthy.
- Nginx health: passed; `inso-nginx` reports healthy and publishes `0.0.0.0:8011->80/tcp`.
- Public health check: passed with `curl -fsS http://localhost:8011/health`.
- Public frontend smoke check: passed with HTTP 200 from `curl -I http://localhost:8011/`.
- Backend/frontend test suites were not rerun during this Docker startup fix.

## 2026-04-22 Cycle 7L Login Fix Validation

- Backend compile: passed with `cd backend && ../.venv/bin/python -m compileall app tests`.
- Focused auth/schema tests: passed with `cd backend && ../.venv/bin/python -m pytest tests/test_auth_schemas.py tests/test_schema_alignment.py -q` (`5 passed`, existing warnings only).
- Frontend build: passed with `cd frontend && npm run build`; Vite still reports the known large-chunk warning.
- Live database default admin hash update: passed with `UPDATE 1` for `admin@inso.local`.
- Docker rebuild: passed with `docker compose up -d --build backend frontend nginx`.
- API login smoke test: passed; `POST http://localhost:8011/api/v1/auth/login` with `admin@inso.local` / `Admin123!` returned HTTP 200.
- Authenticated dashboard API checks: passed for `/api/v1/auth/me`, `/api/v1/dashboard/overview`, `/api/v1/dashboard/alerts-timeline`, `/api/v1/dashboard/mitre-heatmap`, and `/api/v1/alerts/stats`.
- Headless Chromium UI smoke test: passed; login navigated to `http://localhost:8011/dashboard` and rendered the dashboard content.
- Full backend test suite: passed with `cd backend && ../.venv/bin/python -m pytest tests/ -q` (`44 passed`, existing warnings only).
