# Architecture

## Architectural Goal

Inso SIEM should evolve into a modular, tenant-safe, high-volume security analytics platform. The primary foundation is reliable event data: ingestion, parsing, normalization, enrichment, deduplication, retention, search, alerting, and evidence preservation.

## Core Layers

1. Collection layer: forwarders, syslog listeners, REST/webhook ingestion, cloud connectors, file collectors, and SaaS connectors.
2. Transport layer: NATS or Kafka-compatible queue topics with retry, backpressure, and dead-letter handling.
3. Pipeline layer: parser selection, validation, normalization, enrichment, deduplication, and data quality monitoring.
4. Storage layer: PostgreSQL for control-plane entities and ClickHouse for high-volume events.
5. Detection layer: threshold rules, Sigma-style rules, correlation, MITRE mapping, suppression, and simulation.
6. SOC workflow layer: alerts, incidents, cases, evidence, timelines, response actions, and reports.
7. AI layer: evidence-grounded summarization, investigation, query generation, timeline generation, and recommendations.
8. Governance layer: auth, RBAC, tenants, audit logs, data retention, usage metering, compliance, and release controls.

## Non-Negotiable Constraints

- Every event must carry tenant identity.
- AI outputs must cite existing evidence.
- Ingestion must be replay-safe and deduplication-aware.
- Parser failures must be observable and recoverable.
- Control-plane data and event-plane data should not be mixed in the same storage abstraction.

