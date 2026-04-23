# API Contracts

## Contract Rules

- All protected APIs require JWT auth.
- Tenant context comes from the token and is never accepted from request bodies for ordinary tenant users.
- Every route with user input requires Pydantic validation.
- List APIs must support safe pagination or bounded limits.
- Mutating APIs should be idempotent when practical and produce audit events.
- Secret values are write-only and never returned after initial secure setup.

## Priority API Families

- `/api/v1/ingestion/*`: REST/webhook/batch ingestion, replay, dead-letter, malformed events, tokens, rate limits.
- `/api/v1/search/*`: event search, timeline, fields, saved searches, query history, validation, aggregation.
- `/api/v1/detections/*`: rule CRUD, versioning, simulation, MITRE mapping, rollback.
- `/api/v1/alerts/*`: lifecycle, suppression, related evidence, prioritization.
- `/api/v1/incidents/*`: cases, timelines, evidence, response actions.
- `/api/v1/ai/*`: provider settings, query generation, alert summaries, investigation, prompt audit.
- `/api/v1/audit/*`: immutable audit log read/export for authorized users.

