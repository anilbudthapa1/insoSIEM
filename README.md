# Inso SIEM

Inso SIEM is an AI-powered SIEM and SOC operations platform for log ingestion, detection engineering, alert triage, case management, multi-tenant administration, and evidence-based AI assistance.

The current build has 100% app-guide catalog coverage across 500 planned modules, meaning every module has either an implemented API foundation or a partial preview/status foundation. That is not the same as production release readiness. Release hardening, deeper integration tests, full RBAC coverage, UI completion, and security review are still tracked in `docs/known_issues.md`, `.agent_control/release_status.md`, and `.agent_control/sellable_mvp_checklist.md`.

## Quick Links

- Product and module coverage: `docs/APP_GUIDE_COMPLIANCE.md`
- API reference: `docs/api_reference.md`
- Deployment guide: `docs/deployment_guide.md`
- Known issues: `docs/known_issues.md`
- Release checklist: `docs/release_checklist.md`
- Admin guide: `docs/admin_guide.md`
- Analyst guide: `docs/analyst_guide.md`
- Detection rules: `docs/detection_rule_catalog.md`
- MITRE mapping: `docs/mitre_mapping.md`
- Ingestion architecture: `docs/ingestion_architecture.md`
- Normalized event schema: `docs/normalized_event_schema.md`
- Control-plane backlog and state: `.agent_control/`

## Tech Stack

- Backend: FastAPI, SQLAlchemy async, Pydantic, PostgreSQL, Redis, NATS JetStream, ClickHouse, MinIO/S3-compatible storage.
- Frontend: React, Vite, TypeScript, Tailwind CSS, React Query, Zustand, Radix UI, Recharts.
- Infrastructure: Docker Compose, Nginx, PostgreSQL 16, ClickHouse 24, Redis 7, NATS 2, MinIO.
- Detection content: Sigma-style YAML rules and JSON test samples under `detections/`.

## Architecture

The platform separates control-plane data from event-plane data. PostgreSQL stores tenants, users, roles, sessions, agents, detections, alerts, incidents, cases, settings, audit logs, and platform metadata. ClickHouse is used for high-volume event search and analytics. NATS JetStream provides queue-ready ingestion and replay flow. Redis supports authentication, rate limiting, and runtime cache needs. MinIO stores object artifacts such as exports, feeds, and case attachments.

AI features are designed to operate in safe mode with guardrails, redaction, citations, prompt audit trails, and evidence-grounded responses. Production AI behavior must use real indexed events, alerts, cases, detections, and knowledge-base records rather than invented context.

## Feature Map

### Authentication, Tenancy, And Administration

- Tenant bootstrap registration for creating the first organization and administrator.
- Login, logout, access token refresh, refresh-token persistence, token revocation, password reset request/confirm foundations, and MFA/TOTP support.
- Session management APIs for active-session visibility and revocation.
- RBAC with users, roles, permissions, admin dependencies, and route-contract coverage.
- Organization, tenant, MSSP, customer portal, branding, license, usage, billing, and system settings API foundations.
- Admin audit log read and CSV export APIs, with incident workflow audit writes already implemented.
- Multi-tenant request context based on authenticated claims rather than ordinary request body fields.

### Ingestion, Agents, And Forwarders

- REST single-event ingestion, bulk ingestion, batch upload, source webhooks, OTLP-style readiness, malformed-event handling, deduplication, rate limiting, and authenticated ingestion with user JWT or agent API key.
- NATS-backed raw event publishing and degraded-mode startup behavior when queue services are unavailable.
- Syslog startup wiring, TCP/UDP listener behavior, and status/readiness foundations for syslog TLS, gRPC, Kafka, and dead-letter workflows.
- Agent and forwarder enrollment, token lifecycle, heartbeat, health, policy assignment, runtime configuration, collector configuration, platform profiles, tamper status, offline behavior, replay, throttling, compression, encryption, local parsing, masking, filtering, and plugin readiness foundations.
- Collector coverage for Windows, Linux, web, database, Docker, Kubernetes, cloud, firewall, proxy, VPN, DNS, DHCP, WAF, email, EDR, application, and custom sources.

### Parsing, Normalization, Enrichment, Storage, And Search

- Parser foundations for JSON, XML, CSV, syslog, CEF, LEEF, regex, Grok-like matching, field transforms, parser testing, and parser catalog behavior.
- Normalized event model with common SIEM fields, ECS/OCSF/OSSEM alignment notes, schema validation, severity normalization, timestamps, assets, identities, network fields, cloud fields, and threat metadata.
- Enrichment foundations for identity, GeoIP, ASN, DNS, threat intelligence, vulnerability, cloud, MITRE ATT&CK, kill-chain, and risk context.
- Storage API foundations for hot/warm/cold tier status, retention, indexing, sampling, filtering, cost controls, backup status, restore preview, and archive/export readiness.
- Search APIs and UI for event investigation, query validation, saved search foundations, scheduled search foundations, history, templates, permissions, export formats, federated/archive readiness, and natural-language translation foundations for InsoQL, SPL, KQL, and SQL-style workflows.

### Detections, Alerts, Incidents, And Cases

- Detection CRUD and preview foundations with Sigma import/export/convert, custom rules, threshold rules, correlation, sequence logic, statistical/anomaly/ML/behavioral previews, hunting packs, simulation endpoints, benchmark metadata, rule versions, detection-as-code readiness, Git/approval workflow foundations, MITRE mapping, kill-chain mapping, false-positive analytics, and tuning metadata.
- Alert generation, severity and risk scoring, deduplication, grouping, suppression, escalation, assignment, comments, SLA metadata, evidence, timelines, tuning, noise review, queue views, and audit foundations.
- Incident and case CRUD, ownership, severity/status transitions, timeline, notes, evidence handling, chain-of-custody fields, root-cause analysis foundations, linked assets/users/IOCs, collaboration metadata, review states, reporting, executive summary, closure, and case alias foundations.
- Dashboard API and UI shell for analyst workflows, security posture, alert counts, incident status, and investigation entry points.

### AI SOC, Threat Intelligence, And SOAR

- AI safe-mode endpoints for alert summaries, triage, severity suggestions, false-positive analysis, investigation chat, root-cause analysis, timeline generation, hunting prompts, detection suggestions, Sigma/query/report/compliance drafts, playbook/runbook drafts, noise recommendations, correlation explanations, citations, hallucination controls, prompt audit, guardrails, privacy redaction, model/provider settings, RAG readiness, and knowledge-base foundations.
- Threat-intelligence APIs for feeds, IOCs, matching, expiry, confidence, reputation, email intelligence, STIX/TAXII readiness, MISP/VirusTotal/AbuseIPDB/OTX-style integration foundations, actors, malware, campaigns, and dashboard summaries.
- SOAR playbook foundations with manual and automated dry-run execution, builder/test endpoints, approvals, webhooks, email, Slack/Teams/ticket integration foundations, Jira/ServiceNow-style hooks, EDR/firewall/endpoint/user/password/IP/domain/host action previews, safety controls, rate limits, and rollback metadata.

### Assets, Identity, Analytics, Cloud, And Vulnerability Management

- Asset inventory, discovery, cloud assets, attack-surface views, risk scoring, ownership, tags, criticality, and asset-linking foundations.
- Identity inventory for users, AD/LDAP/Entra/Okta/cloud identity readiness, privileged/service account risk, IAM posture, UEBA, baseline behavior, peer groups, impossible travel, MFA fatigue, password spraying, and identity analytics.
- Security analytics packs for dashboards, metrics, UEBA-style signals, SOC analytics, exposure context, and cross-domain risk views.
- Cloud security API foundations for AWS/Azure/GCP posture, account inventory, control-plane events, storage exposure, IAM risks, Kubernetes context, cloud detections, and cloud compliance.
- Vulnerability management foundations for scanner status, asset/vulnerability correlation, risk prioritization, exploitability, exposure graph, SLA metadata, and remediation workflow previews.

### Compliance, SOC Operations, System Admin, And Developer Ecosystem

- Compliance foundations for frameworks, reports, evidence, policies, risk register, gaps, schedules, templates, executive reports, board reports, data residency, privacy policy, and redaction behavior.
- SOC operations APIs for shift handoff, analyst workload, queue health, SLA views, escalation metrics, quality review, runbook status, and operational reporting.
- Simulation and validation APIs for detection tests, ingestion validation, purple-team style checks, parser validation, platform benchmark metadata, and module-readiness reporting.
- System administration APIs for health, configuration, deployment, secrets, key rotation status, token management, vault integration readiness, webhook signature status, and service inventory.
- Developer ecosystem APIs for API gateway metadata, plugin and connector registry foundations, SDK/doc/help/CLI readiness, extension points, and audit coverage metadata.

## API Overview

The backend exposes versioned API groups through `/api/v1` and system endpoints outside the versioned prefix.

Primary groups:

- `/api/v1/auth`
- `/api/v1/sessions`
- `/api/v1/users`
- `/api/v1/rbac`
- `/api/v1/admin`
- `/api/v1/organizations`
- `/api/v1/tenants`
- `/api/v1/mssp`
- `/api/v1/customer-portal`
- `/api/v1/branding`
- `/api/v1/licenses`
- `/api/v1/usage`
- `/api/v1/billing`
- `/api/v1/system-settings`
- `/api/v1/agents`
- `/api/v1/ingest`
- `/api/v1/parsing`
- `/api/v1/enrichment`
- `/api/v1/storage`
- `/api/v1/search`
- `/api/v1/dashboard`
- `/api/v1/detection`
- `/api/v1/alerts`
- `/api/v1/incidents`
- `/api/v1/cases`
- `/api/v1/ai`
- `/api/v1/threat-intel`
- `/api/v1/soar`
- `/api/v1/assets`
- `/api/v1/identity`
- `/api/v1/security-analytics`
- `/api/v1/cloud-security`
- `/api/v1/vulnerabilities`
- `/api/v1/compliance`
- `/api/v1/soc-operations`
- `/api/v1/validation`
- `/api/v1/system-admin`
- `/api/v1/developer`
- `/api/v1/audit`
- `/health`
- `/metrics`

FastAPI interactive docs are served at `/docs` and `/redoc` only when the backend runs in a non-production environment. The Docker Nginx config currently proxies `/api/v1/*` and the frontend; access backend docs directly in local development or add a development-only proxy rule.

## Installation

### Prerequisites

- Docker Engine with Docker Compose v2.
- Node.js 20 or newer for local frontend development.
- Python 3.11 or newer for local backend development.
- OpenSSL for development key generation.
- At least 8 GB RAM for the full Docker stack; ClickHouse and MinIO can be memory-hungry on small machines.

### Recommended: Docker Compose

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Generate secrets:

```bash
make generate-jwt-secret
make generate-fernet
```

3. Edit `.env` and replace every `changeme_*`, `REPLACE_WITH_*`, local-only hostname, and example domain. For local development, set:

```dotenv
APP_ENV=development
APP_URL=http://localhost:8011
HTTP_PORT=8011
HTTPS_PORT=8443
VITE_API_BASE_URL=/api/v1
VITE_WS_URL=ws://localhost:8011/api/v1/ws
JWT_ALGORITHM=HS256
```

4. Start the full stack:

```bash
make dev
```

Equivalent direct command:

```bash
docker compose up -d --build
```

5. Check health:

```bash
docker compose ps
docker compose logs --tail=100 backend
```

Useful local URLs:

- Dashboard: `http://localhost:8011`
- NATS monitor: `http://localhost:8222`
- MinIO UI: `http://localhost:9001`
- Backend health through Nginx: `http://localhost:8011/health`

### Local Backend Development

Run infrastructure in Docker, then run the backend on your host:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
docker compose up -d postgres clickhouse redis nats minio
APP_ENV=development PYTHONPATH=backend .venv/bin/python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs are available at `http://localhost:8000/docs` when `APP_ENV=development`.

### Local Frontend Development

```bash
cd frontend
npm ci
VITE_API_BASE_URL=http://localhost:8000/api/v1 npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

### Database Bootstrap And Migrations

Fresh Docker volumes are initialized from:

- `infra/postgres/init.sql`
- `infra/clickhouse/init.sql`

Existing PostgreSQL databases should be upgraded with Alembic:

```bash
make migrate
```

Do not use `make destroy` unless you intentionally want to delete all Docker volumes and local data.

## Validation

Run these checks before promotion or after a meaningful code change:

```bash
python3 -m compileall backend/app backend/alembic backend/tests
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q
cd frontend && npm run build
docker compose config --quiet
```

Current expected status:

- Backend tests pass.
- Frontend build passes.
- Vite may warn that a JavaScript chunk is larger than 500 kB. That warning is tracked as a known issue and does not currently fail the build.

## Environment Variables

Use `.env.example` as the safe template. Never commit real API keys, database passwords, SMTP passwords, encryption keys, JWT secrets, MinIO credentials, or LLM provider keys.

Important values:

- `APP_ENV`
- `APP_URL`
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `DATABASE_URL` or Compose-provided PostgreSQL settings
- `CLICKHOUSE_HOST`, `CLICKHOUSE_DB`, `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD`
- `REDIS_URL` or `REDIS_PASSWORD`
- `NATS_URL`, `NATS_USER`, `NATS_PASSWORD`
- `MINIO_ENDPOINT`, `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD`
- `JWT_SECRET_KEY`, `JWT_ALGORITHM`, `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`, `JWT_REFRESH_TOKEN_EXPIRE_DAYS`
- `ENCRYPTION_KEY` or `SECRET_ENCRYPTION_KEY`
- `OPENAI_API_KEY`, `OLLAMA_BASE_URL` or `OLLAMA_URL`, `DEFAULT_LLM_PROVIDER`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
- `MAXMIND_LICENSE_KEY`
- `VITE_API_BASE_URL`, `VITE_WS_URL`

## Security Notes

- Passwords are hashed before storage.
- Refresh tokens are stored as hashes and can be revoked.
- MFA secrets use encrypted storage when a Fernet key is configured.
- Protected APIs require bearer tokens.
- Admin routes use RBAC/admin dependencies, with more granular permission coverage still in progress.
- Tenant context comes from authenticated claims.
- AI provider keys must come from environment variables or secure settings, never from source.
- PostgreSQL, Redis, NATS, ClickHouse, and MinIO should not be exposed directly to the public internet in production.
- A full threat model and AppSec review are still release-blocking work.

## Major Problems And Fixes

### `ModuleNotFoundError: No module named app`

Run backend commands with the backend package on `PYTHONPATH`:

```bash
PYTHONPATH=backend .venv/bin/python -m pytest backend/tests -q
APP_ENV=development PYTHONPATH=backend .venv/bin/python -m uvicorn app.main:app --reload
```

You can also run tests from inside `backend/` after activating the virtualenv.

### Insecure Default Values Warning

The backend warns when production mode uses placeholder secrets. Set real values in `.env`:

```bash
make generate-jwt-secret
make generate-fernet
```

Put the generated JWT value in `JWT_SECRET_KEY` and the generated Fernet value in `ENCRYPTION_KEY` or `SECRET_ENCRYPTION_KEY`.

### API Docs Are Missing

FastAPI docs are disabled when `APP_ENV=production`. Set `APP_ENV=development` and run the backend directly at port `8000`, then open `http://localhost:8000/docs`.

### Docker Services Do Not Start

Check configuration and logs:

```bash
docker compose config --quiet
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 postgres
docker compose logs --tail=100 clickhouse
```

Common causes are missing `.env`, unchanged `REPLACE_WITH_*` placeholders, weak service passwords, port conflicts, or not enough local memory.

### Port Conflicts

The Compose stack publishes ports `80`, `443`, `5432`, `6379`, `8123`, `9000`, `9001`, `4222`, and `8222`. Stop the conflicting local service or change the port mapping in `docker-compose.yml`.

The backend syslog listener also binds during app startup. If syslog startup fails, check backend logs and confirm the configured syslog port is free.

### Database Or Migration Errors

Fresh Docker volumes use the SQL bootstrap files. Existing databases need:

```bash
make migrate
```

Schema drift is still tracked in `docs/known_issues.md`; if a route fails against a fresh or long-lived database, compare the ORM model, Alembic migration, and `infra/postgres/init.sql`.

### Redis, NATS, ClickHouse, Or MinIO Connection Errors

Confirm the service is healthy and the backend received the same credentials:

```bash
docker compose ps
docker compose logs --tail=100 redis
docker compose logs --tail=100 nats
docker compose logs --tail=100 clickhouse
docker compose logs --tail=100 minio
```

The backend can start in degraded mode for some infrastructure failures, but endpoints that depend on the unavailable service may fail until the service is healthy.

### Frontend Build Warns About Chunk Size

`npm run build` currently passes, but Vite warns about a JavaScript chunk larger than 500 kB. This is tracked in `docs/known_issues.md`. The fix is route-level code splitting and manual chunks in Vite.

### Frontend Build Fails

Install dependencies from the lockfile and confirm Node 20+:

```bash
cd frontend
node --version
npm ci
npm run build
```

If dependencies are corrupted, remove `frontend/node_modules` and rerun `npm ci`.

### Login Or Registration Fails

Use a password that satisfies the current backend policy, usually 12 or more characters. Organization slugs should be lowercase and URL-safe. Duplicate organization slugs or user emails will be rejected.

### Search Or Dashboard Has No Data

Ingest sample or live events first. Demo logs live under `demo_data/logs/sample_events.jsonl`. Then check NATS and ClickHouse health, backend ingestion logs, and `/api/v1/ingest` route behavior.

### AI Returns Safe/Mock Output

Safe-mode behavior is expected unless a provider is configured and the feature has evidence to use. Configure `OPENAI_API_KEY`, `OLLAMA_BASE_URL` or `OLLAMA_URL`, and `DEFAULT_LLM_PROVIDER`. AI output should remain citation-aware and evidence-grounded.

### `403 Forbidden`

The request is authenticated but lacks the required role or permission. Use an admin account for administrative APIs, check `/api/v1/rbac`, and confirm the bearer token belongs to the expected tenant and user.

### Shell Shows `pyenv: command not found`

This comes from the local shell profile, not the application. Install `pyenv`, remove the stale profile line, or guard it with `command -v pyenv >/dev/null` before initialization.

## Current Release Status

The platform is a strong sellable-MVP foundation, but final release still requires:

- Full database schema drift review.
- Broader audit writes for mutating APIs.
- Granular RBAC enforcement across all SOC/admin routes.
- Runtime integration tests with real PostgreSQL/ClickHouse/NATS paths.
- UI completion for placeholder pages and workflow-specific screens.
- Performance baselines for ingestion, search, dashboards, and alert workloads.
- Full threat model, secure coding review, and remediation log.
- Production deployment hardening with real TLS, secrets management, backups, monitoring, and rollback procedures.

## Useful Commands

```bash
make help
make dev
make ps
make logs-backend
make migrate
make test
make build
make down
```

Dangerous command:

```bash
make destroy
```

`make destroy` removes all Compose volumes and deletes local stack data.

## License

License placeholder. Define commercial or open-source licensing before distribution.
