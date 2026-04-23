# Normalized Event Schema

The normalized event schema is the data foundation for search, detections, dashboards, compliance, and evidence-based AI.

## Required Fields

| Field | Description |
|---|---|
| `id` | Stable event identifier. |
| `timestamp` | Source event time normalized to UTC. |
| `received_at` | Platform ingestion time. |
| `source_type` | Source family such as windows, linux, cloudtrail, firewall, proxy, dns, dhcp, web, edr, or application. |
| `source_name` | Collector, host, service, or integration name. |
| `host` | Hostname when available. |
| `ip_address` | Primary related IP when a single-IP view is useful. |
| `username` | Principal username when available. |
| `event_type` | Authentication, network, process, file, cloud, web, database, endpoint, audit, or alert. |
| `action` | Normalized action such as login, create, update, delete, allow, deny, execute, connect, or query. |
| `status` | success, failure, blocked, allowed, unknown. |
| `severity` | info, low, medium, high, critical. |
| `raw_message` | Original message or payload summary. |
| `parsed_fields` | Parser-specific structured fields. |
| `tenant_id` | Tenant identifier from authenticated source context. |
| `created_at` | Storage timestamp. |

## AI Safety Requirement

AI features must cite event IDs, alert IDs, incident IDs, or case evidence IDs. They must not invent evidence or act on unnormalized, unaudited text alone.

