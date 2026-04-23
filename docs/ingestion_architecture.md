# Ingestion Architecture

## Flow

1. Authenticate source using JWT, API token, agent key, or future mTLS identity.
2. Validate raw event envelope and enforce bounded batch size.
3. Apply tenant context from the authenticated identity.
4. Reject malformed events safely with clear reasons.
5. Publish accepted events to queue-backed processing.
6. Parse events by source type and parser catalog.
7. Normalize parsed fields into the common event schema.
8. Enrich with asset, identity, GeoIP, ASN, cloud, and threat intelligence context.
9. Deduplicate using stable tenant/source/time/raw-hash keys.
10. Store searchable events in ClickHouse and control metadata in PostgreSQL.
11. Emit ingestion health metrics for accepted, rejected, malformed, parser failures, latency, queue depth, and replay batches.

## Reliability Requirements

- Ingestion should be replay-safe.
- Agents should support local buffering during backpressure.
- Parser failures should preserve raw references.
- Dead-letter queues should retain enough context for repair.
- AI features must consume indexed evidence, not raw untrusted payloads directly.

