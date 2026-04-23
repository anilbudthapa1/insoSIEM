# Ingestion Health Report

## Current Assessment

The app has ingestion APIs, a syslog server, NATS startup wiring, parser modules, and many collector policy APIs. The main gap is end-to-end data quality instrumentation: parser failures, source lag, duplicate rates, replay state, malformed events, queue depth, and normalization coverage are not yet fully productized.

## Required Metrics

- Events accepted per tenant/source.
- Events rejected per tenant/source and reason.
- Parser success rate by parser/source/version.
- Parser failure examples with raw references.
- Ingestion latency p50/p95/p99.
- Queue depth by subject.
- Dead-letter count by reason.
- Deduplication hit rate.
- Agent buffer usage and replay batches.
- Normalization field coverage by source.

## Next Implementation Targets

1. Add parser error persistence and dashboard APIs.
2. Add normalized schema validation for parsed events.
3. Add deduplication key calculation and replay state.
4. Add ingestion health endpoint by tenant/source.
5. Add data quality tests with representative samples.

