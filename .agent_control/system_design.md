# System Design

## Event Flow

Collectors and forwarders submit raw events into ingestion APIs or syslog listeners. The ingestion service authenticates the source, applies tenant context, validates envelope shape, assigns an event ID, and publishes to a queue. Pipeline workers parse, normalize, enrich, deduplicate, and write events to ClickHouse. Detection workers evaluate normalized events and create alerts. Alerts can become incidents and cases. AI features consume only indexed events, alerts, incidents, and case evidence.

## Control Plane

PostgreSQL stores users, roles, permissions, organizations, agents, collector policies, detections, alerts, incidents, cases, audit logs, settings, usage, billing metadata, and release metadata.

## Event Plane

ClickHouse stores raw and normalized events, parser errors, ingestion metrics, detection matches, and searchable time-series analytics. Event retention and index lifecycle should be controlled per tenant plan.

## Queue Plane

NATS is currently present and should be used for event topics, parser work, alert work, dead-letter queues, and replay jobs. Kafka compatibility can be added later for enterprise deployments.

## AI Plane

AI provider configuration supports OpenAI-compatible endpoints, Ollama-compatible local endpoints, and custom endpoints. Prompts and outputs are audited. AI responses include confidence and evidence references.

