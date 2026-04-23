# Scalability Plan

## Ingestion

- Use bounded API request sizes.
- Authenticate sources with tenant-scoped tokens or enrolled agents.
- Publish accepted events to NATS subjects by tenant/source/type.
- Add backpressure and dead-letter queues for parser failures.
- Add deduplication keys and replay windows.

## Parsing And Normalization

- Run parser workers horizontally.
- Track parser success/failure by parser, source, tenant, and version.
- Version parser configs and support rollback.
- Preserve raw event and normalized event references.

## Search

- Keep event search in ClickHouse.
- Add query timeouts and bounded result limits.
- Precompute dashboard aggregates where needed.
- Store query history and saved searches in PostgreSQL once usage grows.

## AI

- Avoid sending full raw datasets to AI providers.
- Retrieve bounded evidence windows by IDs.
- Redact PII and secrets before external calls.
- Track token/usage metering and latency.

## Frontend

- Use pagination, virtualization for large tables, and route-level code splitting.
- Avoid loading full event payloads until detail views are opened.

