# Database Design

## PostgreSQL Responsibilities

PostgreSQL owns control-plane data: organizations, users, roles, sessions, agents, policies, detections, alerts, incidents, cases, audit logs, usage, billing metadata, saved searches, watchlists, reports, compliance mappings, and AI audit records.

## ClickHouse Responsibilities

ClickHouse owns event-plane data: raw events, normalized events, parser errors, ingestion latency metrics, detection matches, queryable security telemetry, and dashboard aggregates.

## Near-Term Gaps

- Add first-class saved search and query history models when query volume grows beyond tenant settings storage.
- Add audit log API and immutable retention strategy.
- Add parser error and data quality tables.
- Add detection version tables and rollback history.
- Add usage metering tables for ingestion volume, search volume, AI calls, and storage consumption.

## Indexing Rules

- All tenant-scoped PostgreSQL tables need tenant/org indexes.
- Lifecycle tables need status and updated-at indexes.
- Search-heavy event data belongs in ClickHouse with partitioning by tenant and time.

