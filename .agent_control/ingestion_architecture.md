# Ingestion Architecture

## Goal

Ingestion must produce trustworthy security evidence. Every accepted event should be tenant-scoped, source-attributed, replay-aware, deduplicated, parsed, normalized, enriched, and searchable.

## Required Stages

1. Source authentication: API token, enrolled agent key, mTLS metadata, or trusted connector identity.
2. Envelope validation: tenant, source, timestamp, event type, raw payload, source metadata, and ingestion ID.
3. Replay protection: reject or mark duplicate batch IDs and event IDs within a tenant window.
4. Queue publish: accepted raw events go to NATS subjects such as `inso.events.raw.<tenant>.<source>`.
5. Parser selection: choose parser by collector policy, source type, content type, and event metadata.
6. Parser execution: produce parsed fields or parser error records.
7. Normalization: map parsed fields into the normalized event schema.
8. Enrichment: add asset, identity, GeoIP, ASN, threat intel, and cloud context.
9. Deduplication: compute stable dedup keys from tenant, source, timestamp, event ID, and raw hash.
10. Storage: write raw/normalized event references and searchable event documents to ClickHouse.
11. Detection fan-out: publish normalized events to detection workers.
12. Health reporting: record source lag, parse failures, ingest latency, queue depth, and drop counts.

## Failure Handling

- Malformed events go to a tenant-scoped malformed event store.
- Parser failures go to parser error telemetry with raw event reference.
- Queue or storage failures use retry with bounded attempts and dead-letter routing.
- Backpressure should signal agents to buffer locally when ingestion is overloaded.

