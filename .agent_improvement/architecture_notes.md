# Architecture Notes

## Current Shape

The backend is organized as FastAPI modules with Pydantic schemas, service layers where needed, SQLAlchemy models, JWT auth dependencies, and tenant context in tokens. The frontend uses React, Vite, Tailwind, React Query, and an API client.

## Improvement Direction

Small product improvements should extend existing modules rather than creating parallel stacks. For tenant-scoped settings that do not require high-volume query patterns, `Organization.settings` is acceptable. High-volume entities such as events, alerts, detections, audit logs, and usage should use first-class tables or ClickHouse-backed stores.
