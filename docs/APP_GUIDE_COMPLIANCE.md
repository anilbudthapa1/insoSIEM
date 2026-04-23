# Inso SIEM App Guide Compliance Contract

This project is implemented on the existing FastAPI + SQLAlchemy + Pydantic + React stack. The app guide prompts reference Node.js, Express, Prisma, and Zod; for this repository, those requirements are mapped to equivalent production controls:

- Express routes -> FastAPI routers
- Prisma schema/repository -> SQLAlchemy models and repository/service functions
- Zod validation -> Pydantic request/response schemas plus typed query parameters
- Jest/Supertest -> pytest + FastAPI TestClient/httpx
- JWT/httpOnly refresh-cookie security intent -> JWT access tokens, refresh-token persistence, revocation, and secure cookie support where UI flow uses browser sessions

A module is not considered sellable-complete until it has backend route coverage, service/repository logic, validation, tenant isolation, RBAC, audit events, frontend UI when user-facing, tests, and operational notes.

## Module Status

| Module | Name | Category | Status | Notes |
|---:|---|---|---|---|
| 1 | Authentication Module | Core Platform | Implemented | Auth APIs provide JWT login, refresh, current-user context, token revocation, password hashing, and authenticated route dependencies. |
| 2 | User Registration Module | Core Platform | Implemented | Tenant bootstrap registration creates organization, first admin user, role assignment, and token response with rate limiting. |
| 3 | Login / Logout Module | Core Platform | Implemented | Login verifies password and MFA state; logout blacklists access-token JTI and revokes supplied refresh token hash. |
| 4 | Multi-Factor Authentication Module | Core Platform | Implemented | MFA setup and verify APIs generate encrypted TOTP secret, issue challenge tokens, and enable MFA after verification. |
| 5 | Password Reset Module | Core Platform | Partial | Password reset request and confirm APIs issue hashed Redis reset tokens, reset password hashes, and revoke refresh sessions; email delivery remains future work. |
| 6 | Session Management Module | Core Platform | Implemented | Backend session list/revoke/revoke-others routes with refresh-token persistence and revocation hooks. |
| 7 | User Profile Module | Core Platform | Implemented | Current profile read/update routes backed by users table. |
| 8 | User Management Module | Core Platform | Implemented | Tenant-scoped admin user CRUD foundation backed by users table. |
| 9 | Role-Based Access Control Module | Core Platform | Implemented | Database-backed roles, user-role assignments, and role-permission joins. |
| 10 | Permission Management Module | Core Platform | Implemented | Permission catalog create/list and role grant management. |
| 11 | Admin Management Module | Core Platform | Implemented | Admin overview API for organizations and users. |
| 12 | Organization Management Module | Core Platform | Implemented | Organization CRUD/list/read/update APIs with plan and limits. |
| 13 | Tenant Management Module | Core Platform | Implemented | Tenant aliases backed by organization model for tenant lifecycle foundation. |
| 14 | Multi-Tenant MSSP Console Module | Core Platform | Implemented | MSSP overview and cross-tenant console routes gated to super admin. |
| 15 | Customer Portal Module | Core Platform | Implemented | Customer portal summary route for current tenant usage and plan limits. |
| 16 | White-Label Branding Module | Core Platform | Implemented | White-label branding API backed by tenant organization settings. |
| 17 | License Management Module | Core Platform | Implemented | Tenant license API with plan, limits, status, expiry, and feature flags. |
| 18 | Usage Metering Module | Core Platform | Implemented | Usage summary and usage recording endpoints with tenant limits. |
| 19 | Billing Management Module | Core Platform | Implemented | Billing account and invoice summary APIs backed by tenant settings. |
| 20 | System Settings Module | Core Platform | Implemented | System settings API with tenant-safe operational configuration. |
| 21 | Forwarder Enrollment Module | Agent / Forwarder | Implemented | Forwarder enrollment API with one-time API key issuance and enrollment metadata. |
| 22 | Forwarder Authentication Module | Agent / Forwarder | Implemented | Forwarder API-key authentication endpoint backed by stored key hash verification. |
| 23 | mTLS Agent Authentication Module | Agent / Forwarder | Implemented | mTLS certificate metadata registration for forwarders. |
| 24 | Zero Trust Agent Enrollment Module | Agent / Forwarder | Implemented | Zero-trust posture enrollment with trust score and approval metadata. |
| 25 | Forwarder Policy Group Module | Agent / Forwarder | Implemented | Forwarder policy group create/list/update support stored in agent config metadata. |
| 26 | Forwarder Remote Configuration Module | Agent / Forwarder | Implemented | Per-forwarder remote configuration get/update with versioning. |
| 27 | Forwarder Heartbeat Module | Agent / Forwarder | Implemented | Forwarder heartbeat with metrics and status refresh. |
| 28 | Forwarder Health Monitoring Module | Agent / Forwarder | Implemented | Forwarder health scoring with metrics and issue detection. |
| 29 | Forwarder Status Dashboard Module | Agent / Forwarder | Implemented | Forwarder fleet status dashboard route with online/offline/stale counts. |
| 30 | Forwarder Self-Update Module | Agent / Forwarder | Implemented | Forwarder self-update scheduling and status endpoints. |
| 31 | Forwarder Tamper Protection Module | Agent / Forwarder | Implemented | Tenant-scoped tamper protection policy endpoints plus tamper event reporting and retention in agent runtime config. |
| 32 | Forwarder Offline Buffer Module | Agent / Forwarder | Implemented | Offline buffer policy endpoint with disk, event, flush, and spill-path controls. |
| 33 | Forwarder Offline Replay Module | Agent / Forwarder | Implemented | Offline replay batch reporting with checksum, event counts, last batch, and cumulative replay counters. |
| 34 | Forwarder Performance Throttling Module | Agent / Forwarder | Implemented | Performance throttle policy endpoint with EPS, CPU, memory, and backpressure controls. |
| 35 | Forwarder Compression Module | Agent / Forwarder | Implemented | Compression policy endpoint with algorithm, threshold, and level validation. |
| 36 | Forwarder Encryption Module | Agent / Forwarder | Implemented | Encryption policy endpoint with algorithm, key, and rotation interval validation. |
| 37 | Forwarder Local Parsing Module | Agent / Forwarder | Implemented | Local parsing policy endpoint with parser chain, fallback parser, and failure mode controls. |
| 38 | Forwarder Local Filtering Module | Agent / Forwarder | Implemented | Local filtering policy endpoint with drop/sample rule lists and default action. |
| 39 | Forwarder Sensitive Data Masking Module | Agent / Forwarder | Implemented | Sensitive data masking policy endpoint for built-in masks and custom pattern controls. |
| 40 | Forwarder Plugin SDK Module | Agent / Forwarder | Implemented | Plugin catalog list plus per-forwarder install/remove endpoints with manifest and artifact validation. |
| 41 | Windows Forwarder Module | Agent / Forwarder | Implemented | Windows forwarder profile APIs with service, install path, event channel, WinRM, and account controls. |
| 42 | Linux Forwarder Module | Agent / Forwarder | Implemented | Linux forwarder profile APIs with service, install path, systemd, and journald namespace controls. |
| 43 | macOS Forwarder Module | Agent / Forwarder | Implemented | macOS forwarder profile APIs with launch daemon, install path, and unified log predicate controls. |
| 44 | Container Forwarder Module | Agent / Forwarder | Implemented | Container forwarder profile APIs with runtime, socket, label include, and namespace exclude controls. |
| 45 | Kubernetes Forwarder Module | Agent / Forwarder | Implemented | Kubernetes forwarder profile APIs with cluster, namespace selector, audit/pod log, and service account controls. |
| 46 | Windows Event Log Collector Module | Log Collection | Implemented | Windows Event Log collector policy APIs with channels, bookmark path, batch, and polling controls. |
| 47 | Windows Security Log Collector Module | Log Collection | Implemented | Windows Security collector policy APIs with security event IDs and high-value event controls. |
| 48 | Windows System Log Collector Module | Log Collection | Implemented | Windows System collector policy APIs with level, provider, service, and driver event controls. |
| 49 | Windows Application Log Collector Module | Log Collection | Implemented | Windows Application collector policy APIs with source, level, .NET, and MSI installer controls. |
| 50 | PowerShell Log Collector Module | Log Collection | Implemented | PowerShell collector policy APIs with script block, module, transcription, event ID, and suspicious pattern controls. |
| 51 | Sysmon Log Collector Module | Log Collection | Implemented | Sysmon collector policy APIs with channel, event IDs, ruleset version, hash, and network event controls. |
| 52 | Linux File Log Collector Module | Log Collection | Implemented | Linux file collector policy APIs with path globs, checkpoint, encoding, multiline, and line-size controls. |
| 53 | Linux Auth Log Collector Module | Log Collection | Implemented | Linux auth collector policy APIs with auth paths, SSH, sudo, PAM, and high-value pattern controls. |
| 54 | Linux Syslog Collector Module | Log Collection | Implemented | Linux syslog collector policy APIs with path, facility, severity, and RFC format controls. |
| 55 | Linux Auditd Collector Module | Log Collection | Implemented | Linux auditd collector policy APIs with audit log path, rules path, event type, raw record, and syscall normalization controls. |
| 56 | Linux Journald Collector Module | Log Collection | Implemented | Linux journald collector policy APIs with unit, namespace, cursor, kernel, and since controls. |
| 57 | Apache Log Collector Module | Log Collection | Implemented | Apache collector policy APIs with access/error paths, format, and virtual host controls. |
| 58 | Nginx Log Collector Module | Log Collection | Implemented | Nginx collector policy APIs with access/error paths, format, and server name controls. |
| 59 | IIS Log Collector Module | Log Collection | Implemented | IIS collector policy APIs with log directories, site IDs, field selection, and failed request controls. |
| 60 | Database Audit Log Collector Module | Log Collection | Implemented | Database audit collector policy APIs with engine list, audit paths, statement parsing, redaction, and high-risk operation controls. |
| 61 | Docker Log Collector Module | Log Collection | Implemented | Docker collector policy APIs with socket, include/exclude container, label, stdout, and stderr controls. |
| 62 | Kubernetes Audit Log Collector Module | Log Collection | Implemented | Kubernetes audit collector policy APIs with audit paths, API server, namespace, verb, and redaction controls. |
| 63 | CloudTrail Collector Module | Log Collection | Implemented | CloudTrail collector policy APIs with account, region, S3, SQS, management event, and data event controls. |
| 64 | Azure Activity Log Collector Module | Log Collection | Implemented | Azure Activity collector policy APIs with tenant, subscription, Event Hub, and category controls. |
| 65 | Google Cloud Audit Log Collector Module | Log Collection | Implemented | Google Cloud audit collector policy APIs with project, sink, Pub/Sub subscription, and log name controls. |
| 66 | Firewall Log Collector Module | Log Collection | Implemented | Firewall collector policy APIs with vendor, protocol, port, and action normalization controls. |
| 67 | Proxy Log Collector Module | Log Collection | Implemented | Proxy collector policy APIs with vendor, path, user-agent parsing, URL redaction, and blocked action controls. |
| 68 | VPN Log Collector Module | Log Collection | Implemented | VPN collector policy APIs with vendor, path, auth/session, and high-risk country controls. |
| 69 | DNS Log Collector Module | Log Collection | Implemented | DNS collector policy APIs with source, query type, response, tunneling feature, and redaction controls. |
| 70 | DHCP Log Collector Module | Log Collection | Implemented | DHCP collector policy APIs with source, lease event type, MAC vendor, scope exhaustion, and threshold controls. |
| 71 | WAF Log Collector Module | Log Collection | Implemented | WAF collector policy APIs with vendor, listener protocol, path, blocked action, header, and query-string redaction controls. |
| 72 | Email Security Log Collector Module | Log Collection | Implemented | Email security collector policy APIs with source, vendor, poll interval, message trace, attachment event, and quarantine controls. |
| 73 | EDR/XDR Log Collector Module | Log Collection | Implemented | EDR/XDR collector policy APIs with vendor, endpoint group, API base URL, alert, inventory, process event, and polling controls. |
| 74 | Application Security Log Collector Module | Log Collection | Implemented | Application security collector policy APIs with app list, log paths, framework type, auth/error/security-header, and sensitive-route controls. |
| 75 | Custom File Collector Module | Log Collection | Implemented | Custom file collector policy APIs with paths, parser selection, checkpointing, encoding, multiline, and max line size controls. |
| 76 | Data Ingestion API Module | Ingestion | Implemented | Ingestion APIs expose health, capabilities, authenticated event ingest, bulk ingest, OTLP ingest, queue status, and reliability controls. |
| 77 | REST Log Ingestion Module | Ingestion | Implemented | REST JSON ingest endpoint accepts authenticated single-event payloads through `/api/v1/ingest/rest`. |
| 78 | gRPC Log Ingestion Module | Ingestion | Partial | gRPC ingestion readiness endpoint documents gateway adapter, service name, and auth methods; native gRPC server remains future work. |
| 79 | Syslog TCP Receiver Module | Ingestion | Implemented | Async syslog TCP receiver starts during app lifespan and publishes parsed RFC3164/RFC5424 events to NATS. |
| 80 | Syslog UDP Receiver Module | Ingestion | Implemented | Async syslog UDP receiver starts during app lifespan and publishes parsed RFC3164/RFC5424 events to NATS. |
| 81 | Syslog TLS Receiver Module | Ingestion | Partial | Syslog TLS readiness endpoint documents certificate and mTLS configuration requirements for port 6514. |
| 82 | OpenTelemetry Receiver Module | Ingestion | Implemented | OTLP JSON log receiver converts resourceLogs/scopeLogs/logRecords into RawEvent batches. |
| 83 | Webhook Ingestion Module | Ingestion | Implemented | Authenticated generic webhook endpoint wraps source payloads into tenant-scoped RawEvent records. |
| 84 | Kafka Ingestion Module | Ingestion | Partial | Kafka ingestion readiness endpoint documents topics and SASL/mTLS auth methods; live consumer remains future work. |
| 85 | NATS Ingestion Module | Ingestion | Partial | Ingestion publishes accepted events and malformed dead letters to NATS subjects; external NATS subscription ingest remains future work. |
| 86 | Batch Upload Ingestion Module | Ingestion | Implemented | Batch upload endpoint accepts raw, JSON, or NDJSON line payloads with per-event validation. |
| 87 | API Token Ingestion Module | Ingestion | Implemented | Agent API key ingestion identity is validated through Redis-backed token lookup and tenant override. |
| 88 | Rate Limiting Module | Ingestion | Implemented | Ingestion router is protected by Redis sliding-window rate limiting and exposes policy visibility. |
| 89 | Ingestion Authentication Module | Ingestion | Implemented | Ingestion supports JWT and agent API key identities with `/auth/status` validation. |
| 90 | Ingestion Load Balancer Module | Ingestion | Partial | Queue and capability endpoints expose load-balancer-ready health, but multi-node balancing policy is not implemented yet. |
| 91 | Ingestion Queue Module | Ingestion | Implemented | Accepted events publish to the `inso.events.raw` NATS subject and expose queue health. |
| 92 | Dead-Letter Queue Module | Ingestion | Implemented | Malformed events publish to the `inso.events.dead_letter` subject and expose DLQ status. |
| 93 | Malformed Event Handling Module | Ingestion | Implemented | Authenticated malformed-event endpoint records source, parser, reason, and payload for repair workflows. |
| 94 | Duplicate Event Detection Module | Ingestion | Implemented | Tenant-scoped duplicate check builds stable SHA-256 keys and tracks them in Redis with TTL. |
| 95 | Ingestion Rate Monitoring Module | Ingestion | Implemented | Ingestion health and rate-limit endpoints expose bounded batch, rate window, supported inputs, and queue status. |
| 96 | Pipeline Builder Module | Parsing and Pipeline | Implemented | Parsing pipeline endpoint runs parser selection and normalization for sample events. |
| 97 | Parser Management Module | Parsing and Pipeline | Implemented | Parser catalog endpoint lists available parser types and capabilities. |
| 98 | Parser Marketplace Module | Parsing and Pipeline | Partial | Parser catalog provides marketplace-style discovery metadata; installable third-party parser packages remain future work. |
| 99 | Custom Parser Builder Module | Parsing and Pipeline | Partial | Regex and Grok test endpoints support custom parser prototyping; persisted custom parser lifecycle remains future work. |
| 100 | Regex Parser Module | Parsing and Pipeline | Implemented | Regex parser supports named capture groups through the parser test pipeline. |
| 101 | JSON Parser Module | Parsing and Pipeline | Implemented | JSON parser flattens nested fields, extracts common timestamps, and is exposed through the parsing API. |
| 102 | XML Parser Module | Parsing and Pipeline | Implemented | XML parser flattens elements and attributes into structured fields through the parsing API. |
| 103 | CSV Parser Module | Parsing and Pipeline | Implemented | CSV parser supports supplied headers, delimiter control, timestamp extraction, and parser testing. |
| 104 | Syslog Parser Module | Parsing and Pipeline | Implemented | Syslog parser supports RFC3164/RFC5424 parsing and is exposed through the parsing API. |
| 105 | Windows XML Parser Module | Parsing and Pipeline | Partial | XML parser can flatten Windows-style XML payloads; Windows EventLog-specific semantic mapping remains future work. |
| 106 | CEF Parser Module | Parsing and Pipeline | Implemented | CEF parser extracts header/extensions, maps common CEF keys to ECS-like fields, and normalizes severity. |
| 107 | LEEF Parser Module | Parsing and Pipeline | Implemented | LEEF parser extracts vendor/product/event ID and extension fields through the parsing API. |
| 108 | Grok Parser Module | Parsing and Pipeline | Implemented | Grok parser supports common named patterns such as IP, WORD, DATA, GREEDYDATA, NUMBER, INT, HOSTNAME, and URIPATH. |
| 109 | Parser Testing Module | Parsing and Pipeline | Implemented | `/api/v1/parsing/test` runs selected or automatic parsers against sample messages and returns parsed plus normalized output. |
| 110 | Parser Failure Monitoring Module | Parsing and Pipeline | Partial | Failure monitoring endpoint documents tracked parser failure classes and repair workflow; persistent failure metrics remain future work. |
| 111 | Schema Mapping Module | Parsing and Pipeline | Implemented | Schema mapping endpoint exposes common security event, ECS, OCSF, and OSSEM mapping profiles. |
| 112 | Schema Drift Detection Module | Parsing and Pipeline | Partial | Parser quality controls expose schema mapping gaps; automated drift baselining remains future work. |
| 113 | Data Quality Monitoring Module | Parsing and Pipeline | Partial | Parser and ingestion capabilities expose quality checks for parser match, timestamp, timezone, and field mapping. |
| 114 | Timestamp Normalization Module | Parsing and Pipeline | Implemented | JSON, CSV, CEF, syslog, XML, LEEF, regex, and Grok parser flow normalizes timestamps into Python datetime values. |
| 115 | Time Zone Normalization Module | Parsing and Pipeline | Implemented | Parser timestamp extraction normalizes ISO/Zulu/naive timestamps to timezone-aware UTC handling. |
| 116 | Event Normalization Module | Normalization and Enrichment | Implemented | EventNormalizer maps parsed events into a common normalized event dataclass. |
| 117 | Common Security Event Schema Module | Normalization and Enrichment | Implemented | NormalizedEvent schema covers core, network, event, user, host, process, HTTP, file, enrichment, and MITRE fields. |
| 118 | ECS Mapping Module | Normalization and Enrichment | Implemented | Normalizer maps ECS-like source, destination, network, event, user, host, process, HTTP, and file fields. |
| 119 | OCSF Mapping Module | Normalization and Enrichment | Partial | OCSF profile is exposed in mapping capabilities; full OCSF field converter remains future work. |
| 120 | OSSEM Mapping Module | Normalization and Enrichment | Partial | OSSEM profile is exposed in mapping capabilities; full OSSEM field converter remains future work. |
| 121 | Field Mapping Module | Normalization and Enrichment | Implemented | Normalizer applies generic and source-specific field maps for Windows, Linux, Cisco, and Palo Alto-style sources. |
| 122 | Event Type Classification Module | Normalization and Enrichment | Partial | Event action/category fields are normalized when parsers provide them; richer taxonomy classification remains future work. |
| 123 | Severity Normalization Module | Normalization and Enrichment | Implemented | CEF/syslog parser paths normalize severity values into consistent event fields. |
| 124 | Asset Context Enrichment Module | Normalization and Enrichment | Partial | Asset module provides tenant-scoped inventory and risk context APIs; inline event enrichment hookup remains future work. |
| 125 | Identity Context Enrichment Module | Normalization and Enrichment | Implemented | Enrichment API builds tenant-scoped identity context, confidence, and risk flags from user, domain, email, and source IP fields. |
| 126 | GeoIP Enrichment Module | Normalization and Enrichment | Implemented | EventNormalizer performs optional GeoIP enrichment when a GeoLite database is configured. |
| 127 | ASN Enrichment Module | Normalization and Enrichment | Partial | ASN context endpoint classifies private/external IPs and returns deterministic placeholder ASN data until a real ASN database is configured. |
| 128 | DNS Reverse Lookup Enrichment Module | Normalization and Enrichment | Implemented | DNS reverse lookup endpoint resolves PTR context for tenant-scoped enrichment requests and reports unresolved status safely. |
| 129 | Threat Intelligence Enrichment Module | Normalization and Enrichment | Partial | Threat-intel endpoint scores indicators with deterministic local heuristics; external feed adapters remain future work. |
| 130 | Vulnerability Context Enrichment Module | Normalization and Enrichment | Partial | Vulnerability context endpoint accepts asset/software/CVE context and computes bounded risk; scanner integration remains future work. |
| 131 | Cloud Context Enrichment Module | Normalization and Enrichment | Partial | Cloud context endpoint normalizes provider/account/resource/service metadata and cloud risk hints; cloud inventory sync remains future work. |
| 132 | Process Context Enrichment Module | Normalization and Enrichment | Implemented | Normalized schema and field maps preserve process name, PID, parent PID, and command line context. |
| 133 | MITRE ATT&CK Enrichment Module | Normalization and Enrichment | Implemented | MITRE context endpoint infers ATT&CK tactics from event actions and preserves explicit tactics/techniques as coverage tags. |
| 134 | Kill Chain Enrichment Module | Normalization and Enrichment | Implemented | Kill-chain context endpoint maps action, severity, category, and MITRE tactics to investigation phases. |
| 135 | Risk Context Enrichment Module | Normalization and Enrichment | Partial | Asset risk API computes tenant-scoped risk context from recent alert severity counts; inline event risk enrichment remains future work. |
| 136 | Raw Log Storage Module | Storage and Indexing | Partial | ClickHouse event storage preserves raw messages and fields; storage capability endpoint documents raw storage tiering. |
| 137 | Parsed Event Storage Module | Storage and Indexing | Partial | ClickHouse schema stores parsed fields and normalized fields; storage APIs expose parsed-event storage controls. |
| 138 | Metadata Storage Module | Storage and Indexing | Partial | PostgreSQL-backed modules store operational metadata and storage APIs expose metadata byte accounting placeholders. |
| 139 | Object Storage Module | Storage and Indexing | Partial | Storage tier profiles include object-storage backed cold/archive tiers; object-store write jobs remain future work. |
| 140 | Data Lake Module | Storage and Indexing | Partial | Storage capability API defines data-lake tiers and transition policy; physical lake layout remains future work. |
| 141 | Hot Storage Module | Storage and Indexing | Implemented | Hot tier profile maps interactive search to ClickHouse with seconds-level target latency. |
| 142 | Warm Storage Module | Storage and Indexing | Partial | Warm tier profile and transition policy are exposed; physical compressed warm tier jobs remain future work. |
| 143 | Cold Storage Module | Storage and Indexing | Partial | Cold tier profile and transition policy are exposed for compliance lookup; restore workflow remains future work. |
| 144 | Archive Storage Module | Storage and Indexing | Partial | Archive tier profile models immutable object storage for legal hold; restore/search execution remains future work. |
| 145 | Storage Tiering Module | Storage and Indexing | Implemented | Tiering policy endpoint validates default tier and transition order across hot, warm, cold, and archive tiers. |
| 146 | Indexing Engine Module | Storage and Indexing | Implemented | Indexing policy endpoint exposes ClickHouse-backed full-text, field, and time-series index controls. |
| 147 | Full-Text Indexing Module | Storage and Indexing | Implemented | Search and indexing policies support message/full-text fields for ClickHouse search. |
| 148 | Field Indexing Module | Storage and Indexing | Implemented | Search supports field filters and indexing policy declares tenant field-index controls. |
| 149 | Time-Series Indexing Module | Storage and Indexing | Implemented | Search timeline API and indexing policy support time-bucketed event counts. |
| 150 | Index Lifecycle Management Module | Storage and Indexing | Partial | Index lifecycle rollover policy is validated; scheduled rollover jobs remain future work. |
| 151 | Retention Policy Module | Storage and Indexing | Implemented | Retention policy endpoint validates hot, warm, cold, archive, and immutable day windows. |
| 152 | Immutable Storage Module | Storage and Indexing | Partial | Retention policy models immutable windows and archive guardrails; WORM enforcement remains future work. |
| 153 | Storage Compression Module | Storage and Indexing | Partial | Optimization endpoint exposes zstd compression controls; physical compression job metrics remain future work. |
| 154 | Storage Encryption Module | Storage and Indexing | Partial | Optimization endpoint exposes tenant-scoped AES-256-GCM encryption policy; KMS integration remains future work. |
| 155 | Storage Usage Monitoring Module | Storage and Indexing | Partial | Usage endpoint exposes raw/parsed/metadata/object byte counters; runtime metrics backend remains future work. |
| 156 | Data Volume Optimization Module | Storage and Indexing | Implemented | Optimization endpoint combines compression, sampling, pre-ingestion filtering, tiering, and retention controls. |
| 157 | Data Sampling Module | Storage and Indexing | Implemented | Sampling policy endpoint validates sample rate and severity exemptions. |
| 158 | Pre-Ingestion Filtering Module | Storage and Indexing | Implemented | Pre-ingestion filter endpoint validates source, pattern, and severity keep/drop controls. |
| 159 | Cost Control Module | Storage and Indexing | Implemented | Cost-control endpoint exposes retention, tiering, compression, sampling, and filtering guardrails. |
| 160 | Backup and Restore Module | Storage and Indexing | Partial | Backup status and restore preview endpoints model component restore workflow, production approval, and dry-run restore steps. |
| 161 | Search Engine Module | Search and Query | Implemented | Search API supports ClickHouse-backed event search, timeline, fields, exports, capability reporting, and query helpers. |
| 162 | Field Search Module | Search and Query | Implemented | InsoQL field filters search native event columns and JSON field values. |
| 163 | Full-Text Search Module | Search and Query | Implemented | InsoQL free-text terms search event message and field JSON blobs. |
| 164 | Time Range Search Module | Search and Query | Implemented | Search queries require start/end time windows and timeline API buckets events by time. |
| 165 | Advanced Filter Module | Search and Query | Partial | Query parse endpoint exposes structured filters and free-text terms; richer boolean logic remains future work. |
| 166 | Custom Query Language Module | Search and Query | Implemented | InsoQL parser validates field filters, guards SQL injection patterns, and reconstructs display queries. |
| 167 | SPL-Like Query Module | Search and Query | Partial | Query translation endpoint maps common SPL `index` and `sourcetype` terms to InsoQL drafts. |
| 168 | KQL-Like Query Module | Search and Query | Partial | Query translation endpoint maps simple KQL equality predicates to InsoQL drafts. |
| 169 | SQL Query Module | Search and Query | Partial | Query translation endpoint extracts safe SQL WHERE predicates without executing SQL directly. |
| 170 | Natural Language Query Module | Search and Query | Partial | Deterministic natural-language templates convert common analyst intents into InsoQL drafts. |
| 171 | AI Query Generator Module | Search and Query | Partial | Safe deterministic AI-style query generator returns bounded query templates without autonomous execution. |
| 172 | AI Query Explanation Module | Search and Query | Implemented | Query explanation endpoint describes field filters and free-text terms from InsoQL input. |
| 173 | Saved Search Module | Search and Query | Partial | Tenant-scoped in-memory saved search endpoints exist; database persistence remains future work. |
| 174 | Scheduled Search Module | Search and Query | Partial | Tenant-scoped in-memory scheduled search endpoints exist; scheduler execution remains future work. |
| 175 | Search History Module | Search and Query | Partial | Tenant-scoped in-memory search history records recent backend search executions. |
| 176 | Search Templates Module | Search and Query | Implemented | Search templates endpoint exposes common SOC query templates for identity, triage, endpoint, and network workflows. |
| 177 | Search Export Module | Search and Query | Implemented | Search supports export routes for analyst evidence extraction. |
| 178 | CSV Export Module | Search and Query | Implemented | CSV export endpoint streams selected search result columns with a download filename. |
| 179 | JSON Export Module | Search and Query | Implemented | JSON export endpoint returns bounded search results using the existing SearchResult contract. |
| 180 | PDF Export Module | Search and Query | Implemented | Search PDF export endpoint returns a compact PDF evidence report for bounded search results. |
| 181 | Search Performance Monitor Module | Search and Query | Partial | Search performance endpoint exposes runtime metric placeholders and query-history sample counts. |
| 182 | Search Permission Control Module | Search and Query | Implemented | Search permission endpoint reports tenant scoping, roles, and cross-tenant availability. |
| 183 | Federated Search Module | Search and Query | Partial | Federated search readiness endpoint exposes connector targets; external connector execution remains future work. |
| 184 | Cross-Tenant Search Module | Search and Query | Partial | Permission endpoint gates cross-tenant search visibility to super-admin identities; full cross-tenant query execution remains future work. |
| 185 | Long-Term Archive Search Module | Search and Query | Partial | Archive search readiness endpoint models restore-then-search for cold/archive tiers; physical archive search remains future work. |
| 186 | Detection Rule Management Module | Detection Engineering | Implemented | Detection rule CRUD APIs manage tenant-scoped rules with validation and tests. |
| 187 | Sigma Rule Import Module | Detection Engineering | Partial | Sigma import endpoint extracts metadata and fingerprints rules; persistence workflow remains dry-run by default. |
| 188 | Sigma Rule Export Module | Detection Engineering | Implemented | Detection rule export endpoint emits Sigma-like YAML for tenant rules. |
| 189 | Sigma Rule Converter Module | Detection Engineering | Partial | Sigma conversion endpoint produces InsoQL, threshold, or custom JSON drafts; full Sigma backend conversion remains future work. |
| 190 | Custom Rule Builder Module | Detection Engineering | Implemented | Custom rule validation endpoint checks JSON condition structure for rule builder workflows. |
| 191 | Threshold Detection Module | Detection Engineering | Implemented | Threshold preview endpoint evaluates observed counts against threshold configuration. |
| 192 | Correlation Detection Module | Detection Engineering | Partial | Correlation preview endpoint checks required field co-occurrence; persistent correlation engine remains future work. |
| 193 | Sequence Detection Module | Detection Engineering | Partial | Sequence preview endpoint compares expected and observed event sequences; streaming sequence engine remains future work. |
| 194 | Statistical Detection Module | Detection Engineering | Partial | Statistical preview endpoint computes deviation from a supplied baseline; historical baseline service remains future work. |
| 195 | Anomaly Detection Module | Detection Engineering | Partial | Anomaly preview endpoint computes deterministic anomaly scores; learned model training remains future work. |
| 196 | Machine Learning Detection Module | Detection Engineering | Partial | ML preview endpoint extracts feature keys and deterministic scores; production model runtime remains future work. |
| 197 | Behavioral Detection Module | Detection Engineering | Partial | Behavioral preview endpoint flags unusual identity activity such as impossible travel; baseline learning remains future work. |
| 198 | Threat Hunting Detection Module | Detection Engineering | Implemented | Hunt query endpoint builds deterministic InsoQL drafts from event context. |
| 199 | Rule Testing Module | Detection Engineering | Implemented | Rule test endpoint evaluates tenant rules against sample events. |
| 200 | Rule Simulation Module | Detection Engineering | Implemented | Simulation endpoint runs custom rule logic against bounded sample events and reports match counts. |
| 201 | Rule Performance Benchmarking Module | Detection Engineering | Partial | Benchmark endpoint estimates rule operations from condition and sample counts; runtime performance telemetry remains future work. |
| 202 | Rule Version Control Module | Detection Engineering | Partial | Rule version endpoint exposes current-record version visibility; full revision history remains future work. |
| 203 | Detection-as-Code Module | Detection Engineering | Implemented | Detection-as-code status endpoint points to local detection rule directories and validation mode. |
| 204 | Git Integration for Detection Rules Module | Detection Engineering | Partial | Git status endpoint exposes manual local-rule sync state; remote repository integration remains future work. |
| 205 | Detection Approval Workflow Module | Detection Engineering | Partial | Approval endpoint records approval decisions in the API response; persisted approval states remain future work. |
| 206 | Detection Coverage Gap Analysis Module | Detection Engineering | Implemented | Coverage gap endpoint compares covered ATT&CK tactics with target tactics. |
| 207 | MITRE ATT&CK Mapping Module | Detection Engineering | Implemented | MITRE map endpoint exposes rule-to-tactic mapping for detection coverage. |
| 208 | MITRE Coverage Heatmap Module | Detection Engineering | Implemented | MITRE coverage endpoint returns heatmap-ready tactic rule counts. |
| 209 | Kill Chain Mapping Module | Detection Engineering | Implemented | Kill-chain map endpoint maps detection coverage to investigation phases. |
| 210 | False Positive Analytics Module | Detection Engineering | Partial | False-positive analytics endpoint documents required alert history and recommended tracking actions. |
| 211 | Alert Generation Module | Alerting | Implemented | Alert creation service exists with deduplication and a generation preview endpoint exposes candidate alert payloads. |
| 212 | Alert Severity Module | Alerting | Implemented | Alert severity model endpoint exposes severity ranks used by risk scoring and queueing. |
| 213 | Alert Risk Scoring Module | Alerting | Implemented | Alert risk scoring endpoint combines severity, asset criticality, confidence, and threat-intel score. |
| 214 | Risk-Based Alerting Module | Alerting | Implemented | Risk-based policy endpoint exposes escalation and priority thresholds. |
| 215 | Alert Deduplication Module | Alerting | Implemented | Alert service deduplicates alerts by hash and preview endpoint exposes stable dedup keys. |
| 216 | Alert Grouping Module | Alerting | Implemented | Grouping preview endpoint groups alert-like payloads by configurable fields. |
| 217 | Alert Suppression Module | Alerting | Partial | In-memory suppression policy endpoints exist; database persistence and evaluator hookup remain future work. |
| 218 | Alert Escalation Module | Alerting | Partial | In-memory escalation policy endpoints exist; notification execution remains future work. |
| 219 | Alert Assignment Module | Alerting | Implemented | Alert update API supports tenant-scoped assignment changes. |
| 220 | Alert Comment Module | Alerting | Partial | Alert comment endpoints provide tenant-scoped in-memory comments; database persistence remains future work. |
| 221 | Alert Status Module | Alerting | Implemented | Alert update and acknowledge APIs support status workflow and resolution timestamping. |
| 222 | Alert SLA Module | Alerting | Implemented | Alert SLA endpoint maps severity to response target hours. |
| 223 | Alert Notification Module | Alerting | Partial | Notification preview endpoint builds channel payloads; delivery integrations remain future work. |
| 224 | Alert Evidence Linking Module | Alerting | Partial | Alert evidence endpoints attach in-memory evidence references; durable evidence store remains future work. |
| 225 | Alert Timeline Module | Alerting | Partial | Alert timeline endpoint merges in-memory comments, evidence, and review records. |
| 226 | Alert Tuning Recommendation Module | Alerting | Partial | Tuning endpoint returns deterministic recommendations; rule analytics feedback loop remains future work. |
| 227 | Alert Noise Reduction Module | Alerting | Implemented | Noise-reduction endpoint exposes deduplication, grouping, suppression, thresholds, and tuning controls. |
| 228 | Alert Priority Queue Module | Alerting | Implemented | Priority queue endpoint defines risk, severity, and age sort order for SOC triage. |
| 229 | Alert Review Workflow Module | Alerting | Partial | Alert review endpoint records in-memory review decisions; persistent review workflow remains future work. |
| 230 | Alert Audit Trail Module | Alerting | Partial | Alert audit-trail endpoint returns workflow events and database-audit readiness; durable workflow event persistence remains future work. |
| 231 | Incident Creation Module | Incident and Case Management | Implemented | Tenant-scoped incident create API exists with optional alert linking and audit write attempts. |
| 232 | Incident Management Module | Incident and Case Management | Implemented | Incident list/read/update/delete APIs exist with tenant scoping and linked-alert metadata. |
| 233 | Case Management Module | Incident and Case Management | Partial | Case alias routes reuse the incident service; separate case taxonomy and UI polish remain future work. |
| 234 | Incident Assignment Module | Incident and Case Management | Implemented | Incident update APIs support tenant-scoped assignment changes. |
| 235 | Incident Severity Module | Incident and Case Management | Implemented | Incident severity field and severity model endpoint are available. |
| 236 | Incident Status Module | Incident and Case Management | Implemented | Incident status workflow supports open, investigating, contained, resolved, and closed states. |
| 237 | Incident Timeline Module | Incident and Case Management | Implemented | Incident timeline list/create endpoints record status changes, notes, actions, escalations, artifacts, and linked alerts. |
| 238 | Kill Chain Timeline Module | Incident and Case Management | Partial | Kill-chain timeline endpoint derives investigation phases from incident severity and timeline evidence; full event-backed phase inference remains future work. |
| 239 | Evidence Management Module | Incident and Case Management | Partial | Incident evidence endpoints support tenant-scoped in-memory evidence references; durable evidence storage remains future work. |
| 240 | Chain-of-Custody Module | Incident and Case Management | Partial | Chain-of-custody endpoints record in-memory custody events; immutable custody ledger remains future work. |
| 241 | Root Cause Analysis Module | Incident and Case Management | Partial | Root-cause endpoint records analyst RCA drafts; AI-assisted and persisted RCA workflow remains future work. |
| 242 | Affected Asset Mapping Module | Incident and Case Management | Partial | Affected asset mapping endpoints attach asset/host/IP impact entries; asset inventory joins remain future work. |
| 243 | Affected User Mapping Module | Incident and Case Management | Partial | Affected user mapping endpoints attach user/email impact entries; identity graph joins remain future work. |
| 244 | IOC Linking Module | Incident and Case Management | Partial | Incident IOC endpoints attach indicator references; threat-intel matching integration remains future work. |
| 245 | Incident Collaboration Module | Incident and Case Management | Partial | Incident collaboration endpoint stores in-memory messages; real chat/channel integration remains future work. |
| 246 | Analyst Notes Module | Incident and Case Management | Implemented | Analyst notes are available through timeline note aliases. |
| 247 | Post-Incident Review Module | Incident and Case Management | Partial | Post-incident review endpoint records lessons and action items; durable review workflow remains future work. |
| 248 | Incident Report Generator Module | Incident and Case Management | Partial | Incident report endpoint generates structured report metadata; PDF/HTML report rendering remains future work. |
| 249 | Executive Incident Summary Module | Incident and Case Management | Partial | Executive summary endpoint generates deterministic business-summary text; approval workflow remains future work. |
| 250 | Incident Closure Workflow Module | Incident and Case Management | Partial | Closure endpoint records resolution metadata and moves incidents to closed; approval and evidence-completeness gates remain future work. |
| 251 | AI Alert Summarization Module | AI-Native SOC | Implemented | AI alert summarization endpoint returns deterministic safe-mode summary, findings, and confidence. |
| 252 | AI Alert Triage Module | AI-Native SOC | Implemented | AI triage endpoint recommends priority queue, next steps, and confidence. |
| 253 | AI Severity Recommendation Module | AI-Native SOC | Implemented | AI severity recommendation endpoint maps supplied context to deterministic severity drivers. |
| 254 | AI False Positive Detection Module | AI-Native SOC | Partial | False-positive scoring endpoint uses safe deterministic heuristics; feedback-trained FP model remains future work. |
| 255 | AI Investigation Assistant Module | AI-Native SOC | Implemented | Investigation assistant endpoint returns triage questions, suggested queries, and containment guidance. |
| 256 | AI Root Cause Analysis Module | AI-Native SOC | Partial | AI RCA endpoint drafts hypotheses from context; evidence-grounded RCA engine remains future work. |
| 257 | AI Timeline Generator Module | AI-Native SOC | Implemented | AI timeline endpoint converts supplied events/evidence into ordered timeline entries. |
| 258 | AI Threat Hunting Assistant Module | AI-Native SOC | Implemented | Threat-hunting assistant builds deterministic hunt query and pivot fields from objective context. |
| 259 | AI Detection Rule Generator Module | AI-Native SOC | Partial | Detection rule generator returns disabled draft rules for analyst review; production rule authoring workflow remains future work. |
| 260 | AI Sigma Rule Generator Module | AI-Native SOC | Partial | Sigma generator returns experimental Sigma-like drafts; full Sigma validation and lifecycle remain future work. |
| 261 | AI Query Generator Module | AI-Native SOC | Implemented | AI query generator endpoint turns SOC intent into safe non-executing InsoQL drafts. |
| 262 | AI Query Optimizer Module | AI-Native SOC | Partial | Query optimizer returns bounded optimization notes; cost-based optimizer integration remains future work. |
| 263 | AI Query Explainer Module | AI-Native SOC | Implemented | Query explainer endpoint describes token count and review posture for query drafts. |
| 264 | AI Report Writer Module | AI-Native SOC | Partial | AI report writer creates structured report drafts; formatted report rendering remains future work. |
| 265 | AI Executive Summary Generator Module | AI-Native SOC | Implemented | Executive summary generator returns deterministic business-focused summaries with confidence. |
| 266 | AI Compliance Report Assistant Module | AI-Native SOC | Partial | Compliance assistant drafts report sections by framework; control evidence mapping remains future work. |
| 267 | AI Playbook Builder Module | AI-Native SOC | Partial | Playbook builder returns disabled playbook drafts; approval and SOAR execution remain future work. |
| 268 | AI Runbook Assistant Module | AI-Native SOC | Partial | Runbook assistant returns execution guidance; live runbook state tracking remains future work. |
| 269 | AI Noise Reduction Module | AI-Native SOC | Implemented | AI noise-reduction endpoint recommends grouping, suppression, and threshold controls. |
| 270 | AI Correlation Recommendation Module | AI-Native SOC | Partial | Correlation recommendation endpoint suggests keys and windows; runtime correlation learning remains future work. |
| 271 | AI Evidence Citation Module | AI-Native SOC | Implemented | Evidence citation endpoint creates stable citation IDs from supplied evidence. |
| 272 | AI Hallucination Check Module | AI-Native SOC | Implemented | Hallucination check endpoint compares supplied claims against evidence snippets. |
| 273 | AI Prompt Audit Logging Module | AI-Native SOC | Partial | Prompt audit endpoints hash and retain prompt audit events in memory; durable audit persistence remains future work. |
| 274 | AI Guardrail Policy Module | AI-Native SOC | Implemented | Guardrail policy endpoints expose and update tenant safe-mode controls. |
| 275 | AI Privacy Redaction Policy Module | AI-Native SOC | Implemented | Privacy redaction preview applies email, IP, SSN, and card redaction before AI use. |
| 276 | AI Model Selection Module | AI-Native SOC | Implemented | Model selection endpoint exposes configured provider, model, and deterministic fallbacks. |
| 277 | Local LLM Integration Module | AI-Native SOC | Partial | Local LLM status endpoint reports configured local provider readiness; live local inference remains future work. |
| 278 | Cloud LLM Integration Module | AI-Native SOC | Partial | Cloud LLM status endpoint reports configured cloud provider readiness; live cloud inference remains future work. |
| 279 | Vector Database / RAG Module | AI-Native SOC | Partial | RAG endpoint answers only from supplied evidence until vector database storage is configured. |
| 280 | SOC Knowledge Base Module | AI-Native SOC | Partial | Knowledge-base article and search endpoints exist under AI safe mode; durable vector-backed storage remains future work. |
| 281 | Threat Intelligence Feed Management Module | Threat Intelligence | Partial | Threat-intel feed list/create endpoints exist with in-memory tenant state; scheduled feed polling remains future work. |
| 282 | IOC Management Module | Threat Intelligence | Partial | IOC list/create endpoints normalize indicator type, confidence, reputation, source, tags, and expiry; database persistence remains future work. |
| 283 | IOC Matching Module | Threat Intelligence | Implemented | IOC matching endpoint compares tenant indicators against supplied indicators and event fields. |
| 284 | IOC Expiry Module | Threat Intelligence | Implemented | IOC expiry endpoint returns expired and expiring-soon indicators from tenant IOC state. |
| 285 | IOC Confidence Scoring Module | Threat Intelligence | Implemented | Confidence scoring endpoint combines source reliability, analyst score, and sightings. |
| 286 | IP Reputation Module | Threat Intelligence | Implemented | IP reputation endpoint returns deterministic local reputation score. |
| 287 | Domain Reputation Module | Threat Intelligence | Implemented | Domain reputation endpoint returns deterministic local reputation score. |
| 288 | URL Reputation Module | Threat Intelligence | Implemented | URL reputation endpoint returns deterministic local reputation score. |
| 289 | File Hash Reputation Module | Threat Intelligence | Implemented | Hash reputation endpoint returns deterministic local reputation score. |
| 290 | Email IOC Module | Threat Intelligence | Implemented | Email IOC reputation endpoint returns deterministic local reputation score. |
| 291 | MISP Integration Module | Threat Intelligence | Partial | MISP integration status endpoint documents required configuration; live feed sync remains future work. |
| 292 | VirusTotal Integration Module | Threat Intelligence | Partial | VirusTotal integration status endpoint documents required configuration; live lookup remains future work. |
| 293 | AbuseIPDB Integration Module | Threat Intelligence | Partial | AbuseIPDB integration status endpoint documents required configuration; live lookup remains future work. |
| 294 | AlienVault OTX Integration Module | Threat Intelligence | Partial | AlienVault OTX integration status endpoint documents required configuration; live pulse sync remains future work. |
| 295 | STIX/TAXII Integration Module | Threat Intelligence | Partial | STIX/TAXII status endpoint documents required configuration; collection polling remains future work. |
| 296 | Threat Feed Deduplication Module | Threat Intelligence | Implemented | Feed deduplication endpoint removes repeated indicator records by configured field. |
| 297 | Threat Actor Profile Module | Threat Intelligence | Partial | Threat actor profile endpoints store actor aliases, motivations, and regions in tenant memory; graph persistence remains future work. |
| 298 | Malware Family Mapping Module | Threat Intelligence | Partial | Malware family endpoints store aliases, platforms, and ATT&CK techniques in tenant memory; graph persistence remains future work. |
| 299 | Campaign Mapping Module | Threat Intelligence | Partial | Campaign endpoints link actors, malware families, and IOCs in tenant memory; relationship graph remains future work. |
| 300 | Threat Intelligence Dashboard Module | Threat Intelligence | Partial | Threat-intel dashboard endpoint summarizes feed, IOC, actor, malware, and campaign counts; persistent metrics remain future work. |
| 301 | SOAR Playbook Module | SOAR and Automation | Partial | SOAR playbook list/create endpoints exist with in-memory tenant state; durable playbook storage remains future work. |
| 302 | Playbook Builder Module | SOAR and Automation | Partial | Playbook builder preview validates trigger, enabled state, and step count; visual builder UI remains future work. |
| 303 | Playbook Testing Sandbox Module | SOAR and Automation | Implemented | Playbook sandbox endpoint runs dry-run step evaluation against sample alert context. |
| 304 | Manual Response Action Module | SOAR and Automation | Implemented | Manual action preview endpoint records audit event, risk score, and approval requirement. |
| 305 | Automated Response Action Module | SOAR and Automation | Partial | Automated action endpoint is dry-run only and always requires approval; live execution remains future work. |
| 306 | Approval Workflow Module | SOAR and Automation | Partial | Approval list/create endpoints record in-memory approval decisions; durable workflow queues remain future work. |
| 307 | Webhook Action Module | SOAR and Automation | Partial | Webhook action preview endpoint builds dry-run request metadata; outbound delivery remains future work. |
| 308 | Email Notification Module | SOAR and Automation | Partial | Email notification preview endpoint builds payloads; SMTP/provider delivery remains future work. |
| 309 | Slack Notification Module | SOAR and Automation | Partial | Slack notification preview endpoint builds payloads; Slack delivery integration remains future work. |
| 310 | Microsoft Teams Notification Module | SOAR and Automation | Partial | Teams notification preview endpoint builds payloads; Teams delivery integration remains future work. |
| 311 | Ticket Creation Module | SOAR and Automation | Partial | Ticket creation preview endpoint builds external ticket payloads; live ticket creation remains future work. |
| 312 | Jira Integration Module | SOAR and Automation | Partial | Jira status endpoint reports status-only readiness; live Jira ticket sync remains future work. |
| 313 | ServiceNow Integration Module | SOAR and Automation | Partial | ServiceNow status endpoint reports status-only readiness; live incident sync remains future work. |
| 314 | Firewall Blocklist Export Module | SOAR and Automation | Implemented | Firewall blocklist export endpoint deduplicates supplied indicators and returns plain/csv/json-ready data. |
| 315 | EDR Response Integration Module | SOAR and Automation | Partial | EDR response integration status endpoint reports status-only readiness; live EDR actions remain future work. |
| 316 | Endpoint Isolation Integration Module | SOAR and Automation | Partial | Endpoint isolation preview endpoint scores risk and requires approval; live EDR isolation remains future work. |
| 317 | User Disable Action Module | SOAR and Automation | Partial | User disable preview endpoint scores risk and requires approval; identity-provider execution remains future work. |
| 318 | Password Reset Action Module | SOAR and Automation | Partial | Password reset preview endpoint scores risk and requires approval; identity-provider execution remains future work. |
| 319 | IP Block Action Module | SOAR and Automation | Partial | IP block preview endpoint scores risk; firewall execution remains future work. |
| 320 | Domain Block Action Module | SOAR and Automation | Partial | Domain block preview endpoint scores risk; DNS/proxy execution remains future work. |
| 321 | Host Quarantine Action Module | SOAR and Automation | Partial | Host quarantine preview endpoint scores risk and requires approval; live quarantine remains future work. |
| 322 | Automation Audit Log Module | SOAR and Automation | Partial | Automation audit log endpoint returns in-memory workflow events; persistent audit linkage remains future work. |
| 323 | Automation Safety Control Module | SOAR and Automation | Implemented | Safety-control endpoints expose approval, dry-run, and blocked-action policy. |
| 324 | Automation Rate Limit Module | SOAR and Automation | Implemented | Automation rate-limit endpoints expose and update action-per-minute and high-risk limits. |
| 325 | Rollback Action Module | SOAR and Automation | Partial | Rollback preview endpoint reports rollback metadata and approval need; live rollback execution remains future work. |
| 326 | Asset Inventory Module | Asset, Identity, and UEBA | Implemented | Asset CRUD and inventory summary endpoints provide tenant-scoped asset inventory coverage. |
| 327 | Asset Discovery Module | Asset, Identity, and UEBA | Partial | Asset discovery preview estimates discovered assets from sources, CIDRs, cloud accounts, and domains; scanners remain future work. |
| 328 | Cloud Asset Discovery Module | Asset, Identity, and UEBA | Partial | Cloud discovery preview estimates resources and required permissions; cloud inventory connectors remain future work. |
| 329 | Attack Surface Discovery Module | Asset, Identity, and UEBA | Partial | Attack-surface preview scores public IP and exposed-port inputs; live external scanning remains future work. |
| 330 | Asset Risk Scoring Module | Asset, Identity, and UEBA | Implemented | Asset risk model and score endpoints combine criticality, exposure, vulnerabilities, alerts, and internet-facing state. |
| 331 | Asset Ownership Module | Asset, Identity, and UEBA | Partial | Asset ownership policy endpoints exist and asset records include owner fields; ownership workflows and attestations remain future work. |
| 332 | Asset Tagging Module | Asset, Identity, and UEBA | Implemented | Asset CRUD stores tags and tagging preview endpoint derives normalized asset tags. |
| 333 | Asset Criticality Module | Asset, Identity, and UEBA | Implemented | Asset criticality model and score endpoints derive low/medium/high/critical from business and exposure context. |
| 334 | User Inventory Module | Asset, Identity, and UEBA | Partial | User inventory summary endpoint exists; full directory-backed user inventory remains future work. |
| 335 | Identity Inventory Module | Asset, Identity, and UEBA | Partial | Identity inventory endpoints store local identity records in tenant memory; database and directory sync remain future work. |
| 336 | Active Directory Integration Module | Asset, Identity, and UEBA | Partial | Active Directory integration status endpoint documents required permissions; live AD sync remains future work. |
| 337 | LDAP Integration Module | Asset, Identity, and UEBA | Partial | LDAP integration status endpoint documents required permissions; live LDAP sync remains future work. |
| 338 | Azure AD / Entra ID Integration Module | Asset, Identity, and UEBA | Partial | Entra ID integration status endpoint documents required permissions; live Graph sync remains future work. |
| 339 | Okta Integration Module | Asset, Identity, and UEBA | Partial | Okta integration status endpoint documents required permissions; live Okta sync remains future work. |
| 340 | Cloud Identity Integration Module | Asset, Identity, and UEBA | Partial | Cloud identity integration status endpoint documents readiness; live cloud identity connectors remain future work. |
| 341 | Privileged Account Monitoring Module | Asset, Identity, and UEBA | Partial | Privileged-account monitoring endpoint scores supplied events; persistent privileged session monitoring remains future work. |
| 342 | Service Account Monitoring Module | Asset, Identity, and UEBA | Partial | Service-account monitoring endpoint flags interactive service logins in supplied events; persistent monitoring remains future work. |
| 343 | IAM Risk Monitoring Module | Asset, Identity, and UEBA | Implemented | IAM risk scoring endpoint combines privileged status, MFA, stale age, failed logins, and risky group count. |
| 344 | User Behavior Analytics Module | Asset, Identity, and UEBA | Partial | User behavior endpoint computes failed events, countries, and anomaly score from supplied events; learned UEBA models remain future work. |
| 345 | Entity Behavior Analytics Module | Asset, Identity, and UEBA | Partial | Entity behavior endpoint scores source and action variety from supplied events; durable entity baselines remain future work. |
| 346 | Baseline Learning Module | Asset, Identity, and UEBA | Partial | Baseline learning endpoint records per-entity baseline metadata in memory; persisted baseline service remains future work. |
| 347 | Peer Group Analytics Module | Asset, Identity, and UEBA | Partial | Peer group endpoint groups supplied events by department and flags outliers; identity graph joins remain future work. |
| 348 | Impossible Travel Detection Module | Asset, Identity, and UEBA | Implemented | Impossible-travel endpoint computes geo distance and velocity to flag impossible movement. |
| 349 | MFA Fatigue Detection Module | Asset, Identity, and UEBA | Implemented | MFA fatigue endpoint flags repeated challenge denial/timeout patterns. |
| 350 | Password Spraying Detection Module | Asset, Identity, and UEBA | Implemented | Password spraying endpoint flags many failed users from common sources. |
| 351 | Authentication Analytics Module | Security Analytics and Detection Packs | Partial | Authentication analytics pack scores supplied events for failed login, brute-force, lockout, MFA, and impossible-travel signals. |
| 352 | PowerShell Analytics Module | Security Analytics and Detection Packs | Partial | PowerShell analytics pack scores supplied events for encoded commands, download strings, IEX, bypass, and AMSI signals. |
| 353 | Process Tree Analysis Module | Security Analytics and Detection Packs | Partial | Process-tree analytics pack scores supplied parent/child process signals; endpoint telemetry graphing remains future work. |
| 354 | File Integrity Monitoring Module | Security Analytics and Detection Packs | Partial | File-integrity analytics pack scores supplied file change signals; agent-backed FIM remains future work. |
| 355 | Registry Monitoring Module | Security Analytics and Detection Packs | Partial | Registry analytics pack scores supplied run key, autorun, service, and winlogon signals; full Windows registry ingestion remains future work. |
| 356 | USB Device Monitoring Module | Security Analytics and Detection Packs | Partial | USB analytics pack scores supplied removable-device signals; endpoint device inventory integration remains future work. |
| 357 | Remote Access Monitoring Module | Security Analytics and Detection Packs | Partial | Remote-access analytics pack scores supplied RDP, SSH, VNC, remote, and WinRM signals. |
| 358 | VPN Analytics Module | Security Analytics and Detection Packs | Partial | VPN analytics pack scores supplied VPN, geo, new-device, failure, and split-tunnel signals. |
| 359 | DNS Query Analytics Module | Security Analytics and Detection Packs | Partial | DNS analytics pack scores supplied DGA, tunneling, TXT, NXDOMAIN, and C2 signals. |
| 360 | Network Flow Analysis Module | Security Analytics and Detection Packs | Partial | Network-flow analytics pack scores supplied flow, beacon, rare-port, external, and bytes-out signals. |
| 361 | Packet Metadata Analysis Module | Security Analytics and Detection Packs | Partial | Packet metadata analytics pack scores supplied JA3, SNI, TLS, user-agent, and DNS metadata. |
| 362 | WAF Log Analysis Module | Security Analytics and Detection Packs | Partial | WAF analytics pack scores supplied blocked, SQLi, XSS, RFI, and LFI signals. |
| 363 | Web Attack Detection Module | Security Analytics and Detection Packs | Partial | Web attack analytics pack scores supplied traversal, SQLi, XSS, command, and webshell signals. |
| 364 | Database Attack Detection Module | Security Analytics and Detection Packs | Partial | Database attack analytics pack scores supplied destructive SQL, dump, xp_cmdshell, failed login, and privilege signals. |
| 365 | Cloud Misconfiguration Detection Module | Security Analytics and Detection Packs | Partial | Cloud misconfiguration analytics pack scores public, wildcard, unencrypted, and admin exposure signals. |
| 366 | Lateral Movement Detection Module | Security Analytics and Detection Packs | Partial | Lateral movement analytics pack scores PsExec, WMIC, SMB, WinRM, and remote-service signals. |
| 367 | Privilege Escalation Detection Module | Security Analytics and Detection Packs | Partial | Privilege escalation analytics pack scores sudo, admin, token, UAC, setuid, and role-assignment signals. |
| 368 | Data Exfiltration Detection Module | Security Analytics and Detection Packs | Partial | Data exfiltration analytics pack scores upload, archive, large-transfer, cloud storage, and bytes-out signals. |
| 369 | Ransomware Behavior Detection Module | Security Analytics and Detection Packs | Partial | Ransomware analytics pack scores encryption, shadow copy, ransom, mass-rename, and vssadmin signals. |
| 370 | Command and Control Detection Module | Security Analytics and Detection Packs | Partial | C2 analytics pack scores beacon, C2, DNS tunnel, rare domain, and periodic traffic signals. |
| 371 | Insider Threat Detection Module | Security Analytics and Detection Packs | Partial | Insider-threat analytics pack scores after-hours, bulk-download, USB, termination, and sensitive-data signals. |
| 372 | Malware Behavior Detection Module | Security Analytics and Detection Packs | Partial | Malware behavior analytics pack scores injection, beaconing, persistence, dropper, and suspicious process signals. |
| 373 | Credential Theft Detection Module | Security Analytics and Detection Packs | Partial | Credential-theft analytics pack scores LSASS, Mimikatz, password, credential, and dump signals. |
| 374 | Persistence Detection Module | Security Analytics and Detection Packs | Partial | Persistence analytics pack scores run keys, service creation, scheduled task, startup, and cron signals. |
| 375 | Defense Evasion Detection Module | Security Analytics and Detection Packs | Partial | Defense-evasion analytics pack scores defender disablement, log clearing, obfuscation, bypass, and tamper signals. |
| 376 | AWS Security Module | Cloud, Container, and DevSecOps | Partial | AWS security analytics endpoint scores supplied IAM, root, security group, public S3, and CloudTrail signals. |
| 377 | Azure Security Module | Cloud, Container, and DevSecOps | Partial | Azure security analytics endpoint scores supplied Entra, role assignment, Key Vault, public storage, and conditional-access signals. |
| 378 | Google Cloud Security Module | Cloud, Container, and DevSecOps | Partial | GCP security analytics endpoint scores supplied IAM, service account, public bucket, firewall, and audit-log signals. |
| 379 | CloudTrail Analysis Module | Cloud, Container, and DevSecOps | Partial | CloudTrail analytics endpoint scores supplied CloudTrail events and returns a deterministic event fingerprint. |
| 380 | Azure Activity Log Analysis Module | Cloud, Container, and DevSecOps | Partial | Cloud-security API scores supplied Azure Activity Log events for role, delete, Key Vault, storage, conditional-access, and owner signals; live Azure connector remains future work. |
| 381 | Google Cloud Audit Log Analysis Module | Cloud, Container, and DevSecOps | Partial | Cloud-security API scores supplied GCP audit events for IAM policy, service account, bucket, firewall, and admin activity signals; live GCP connector remains future work. |
| 382 | Cloud IAM Monitoring Module | Cloud, Container, and DevSecOps | Partial | Cloud IAM monitoring endpoint scores supplied IAM events for admin, wildcard, MFA, access key, assume-role, and service-account risks. |
| 383 | Cloud Storage Monitoring Module | Cloud, Container, and DevSecOps | Partial | Cloud storage monitoring endpoint scores public, anonymous, unencrypted, versioning-disabled, bucket-delete, and public blob signals. |
| 384 | Cloud Network Monitoring Module | Cloud, Container, and DevSecOps | Partial | Cloud network monitoring endpoint scores open ingress, public IP, firewall/security-group, SSH, and RDP exposure signals. |
| 385 | Cloud Workload Monitoring Module | Cloud, Container, and DevSecOps | Partial | Cloud workload monitoring endpoint scores metadata credential, privileged workload, unpatched, internet-facing, serverless, and instance-profile risks. |
| 386 | Container Runtime Security Module | Cloud, Container, and DevSecOps | Partial | Container runtime endpoint scores privileged, host namespace, docker socket, capability, and escape signals from supplied runtime events. |
| 387 | Kubernetes Security Module | Cloud, Container, and DevSecOps | Partial | Kubernetes security endpoint scores privileged pod, hostPath, cluster-admin, service-account token, missing network policy, and admission risks. |
| 388 | Kubernetes Audit Log Analysis Module | Cloud, Container, and DevSecOps | Partial | Kubernetes audit endpoint scores create-pod, exec, secret deletion, rolebinding patch, impersonation, and anonymous access signals. |
| 389 | Kubernetes RBAC Monitoring Module | Cloud, Container, and DevSecOps | Partial | Kubernetes RBAC monitor flags cluster-admin, wildcard namespace, and privileged-group bindings from supplied binding data. |
| 390 | Docker Security Module | Cloud, Container, and DevSecOps | Partial | Docker security endpoint scores docker socket, latest tag, root user, privileged, host mount, and missing healthcheck signals. |
| 391 | CI/CD Log Monitoring Module | Cloud, Container, and DevSecOps | Partial | CI/CD monitor scores failed deploy, approval bypass, runner, secret, force-push, and unsigned-artifact signals. |
| 392 | GitHub Security Integration Module | Cloud, Container, and DevSecOps | Partial | GitHub integration status endpoint documents required read permissions and confirms secrets are not returned. |
| 393 | GitLab Security Integration Module | Cloud, Container, and DevSecOps | Partial | GitLab integration status endpoint documents required API/repository/security permissions and confirms secrets are not returned. |
| 394 | Secrets Detection Module | Cloud, Container, and DevSecOps | Partial | Secrets detection endpoint scans supplied artifacts for common secret patterns and returns redacted fingerprints only. |
| 395 | DevSecOps Dashboard Module | Cloud, Container, and DevSecOps | Partial | DevSecOps dashboard endpoint exposes widget/data-source readiness for cloud IAM, container runtime, Kubernetes audit, CI/CD, secrets, and integrations. |
| 396 | Vulnerability Scanner Integration Module | Vulnerability and Exposure Management | Partial | Vulnerability scanner status endpoint lists supported scanner families and configuration readiness. |
| 397 | Nessus Integration Module | Vulnerability and Exposure Management | Partial | Nessus status endpoint documents required scan and asset read permissions; live import remains future work. |
| 398 | OpenVAS Integration Module | Vulnerability and Exposure Management | Partial | OpenVAS status endpoint documents task/report permissions; live import remains future work. |
| 399 | Qualys Integration Module | Vulnerability and Exposure Management | Partial | Qualys status endpoint documents VM and asset read permissions; live import remains future work. |
| 400 | Vulnerability Context Module | Vulnerability and Exposure Management | Partial | Vulnerability context endpoint combines CVE count, CVSS, EPSS, exploit availability, exposure, and business criticality into tenant-scoped risk context. |
| 401 | CVE Mapping Module | Vulnerability and Exposure Management | Partial | CVE mapping endpoint normalizes scanner findings into CVE, severity, CVSS, and source rows. |
| 402 | Exploitability Scoring Module | Vulnerability and Exposure Management | Partial | Exploitability endpoint scores CVSS, EPSS, exploit availability, and internet exposure. |
| 403 | EPSS Scoring Module | Vulnerability and Exposure Management | Partial | EPSS endpoint normalizes EPSS into percent and priority signals. |
| 404 | Asset Vulnerability Risk Module | Vulnerability and Exposure Management | Partial | Asset vulnerability risk endpoint combines exploitability, CVE count, and business criticality for asset-level prioritization. |
| 405 | Patch Status Monitoring Module | Vulnerability and Exposure Management | Partial | Patch status endpoint computes stale asset, unsupported OS, and patch-compliance percentages from supplied asset data. |
| 406 | Exposure Dashboard Module | Vulnerability and Exposure Management | Partial | Exposure dashboard endpoint exposes scoring and widget readiness for exposed assets, critical vulnerabilities, known exploited issues, and patch staleness. |
| 407 | Attack Path Visualization Module | Vulnerability and Exposure Management | Partial | Attack-path endpoint builds graph summary metadata from supplied entities and relationships. |
| 408 | Entity Relationship Graph Module | Vulnerability and Exposure Management | Partial | Entity graph endpoint validates supplied graph entities and relationships for investigation visualization. |
| 409 | Investigation Graph Module | Vulnerability and Exposure Management | Partial | Investigation graph endpoint builds evidence-ready graph summaries for supplied investigation entities. |
| 410 | Attack Surface Risk Module | Vulnerability and Exposure Management | Partial | Attack-surface risk endpoint scores exposure, critical vulnerabilities, known exploited findings, and stale assets. |
| 411 | Compliance Dashboard Module | Compliance and Governance | Partial | Compliance dashboard endpoint exposes framework and widget readiness for coverage, gaps, evidence freshness, policy status, and residency. |
| 412 | ISO 27001 Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns ISO 27001 controls and evidence types for evidence collection readiness. |
| 413 | NIST CSF Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns NIST CSF functions and evidence types. |
| 414 | NIST 800-53 Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns NIST 800-53 control families and evidence types. |
| 415 | PCI DSS Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns PCI DSS control groups and evidence types. |
| 416 | SOC 2 Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns SOC 2 trust-service control groups and evidence types. |
| 417 | HIPAA Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns HIPAA safeguard groups and evidence types. |
| 418 | GDPR Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns GDPR privacy/security control groups and evidence types. |
| 419 | Essential Eight Mapping Module | Compliance and Governance | Partial | Framework mapping endpoint returns Essential Eight maturity controls and evidence types. |
| 420 | Audit Report Module | Compliance and Governance | Partial | Audit report endpoint generates structured report metadata with scope, control summary, evidence index, gaps, and management response sections. |
| 421 | Control Evidence Module | Compliance and Governance | Partial | Control evidence endpoint records tenant-scoped evidence metadata and stable evidence IDs without storing raw sensitive files. |
| 422 | Policy Management Module | Compliance and Governance | Partial | In-memory policy list/create endpoints track policy metadata by tenant; durable policy repository remains future work. |
| 423 | Risk Register Module | Compliance and Governance | Partial | Risk register endpoint scores likelihood and impact with owner and treatment metadata. |
| 424 | Compliance Gap Analysis Module | Compliance and Governance | Partial | Gap-analysis endpoint computes coverage, gap count, high-risk gaps, and status from supplied control counts. |
| 425 | Scheduled Compliance Report Module | Compliance and Governance | Partial | Scheduled report endpoint creates deterministic schedule metadata for cadence, recipients, framework, and period. |
| 426 | Report Template Builder Module | Compliance and Governance | Partial | Report template builder returns audience-specific report section templates. |
| 427 | Executive Dashboard Module | Compliance and Governance | Partial | Executive dashboard endpoint exposes business-language widgets for posture, risk trend, audit readiness, and material gaps. |
| 428 | Board-Level Report Module | Compliance and Governance | Partial | Board report endpoint generates board-level report metadata for risk position, control maturity, regulatory exposure, and investments. |
| 429 | Data Residency Control Module | Compliance and Governance | Partial | Data residency endpoints read/update tenant policy for allowed/restricted regions, cross-border PII, legal hold, and conflict detection. |
| 430 | Privacy Management Module | Compliance and Governance | Partial | Privacy policy and redaction preview endpoints score PII redaction, data subject request windows, consent posture, retention basis, and sensitive fields. |
| 431 | SOC Overview Dashboard Module | SOC Operations and Metrics | Partial | SOC overview endpoint exposes alert, case, SLA, workload, and detection-quality dashboard widgets. |
| 432 | Custom Dashboard Builder Module | SOC Operations and Metrics | Partial | Dashboard builder preview validates dashboard name, widgets, and time range without persisting layouts. |
| 433 | Widget Management Module | SOC Operations and Metrics | Partial | In-memory tenant widget list/create endpoints manage widget metadata; durable widget storage remains future work. |
| 434 | Dashboard Sharing Module | SOC Operations and Metrics | Partial | Dashboard sharing preview validates recipients and view/edit permission metadata. |
| 435 | Analyst Workload Dashboard Module | SOC Operations and Metrics | Partial | Analyst workload endpoint summarizes case assignments by analyst from supplied case data. |
| 436 | SOC Metrics Module | SOC Operations and Metrics | Partial | SOC metrics endpoint summarizes alert volume, case backlog, MTTD, and MTTR from supplied event/case data. |
| 437 | KPI Dashboard Module | SOC Operations and Metrics | Partial | KPI dashboard endpoint exposes alert count, open cases, active detections, and SLA breach counts. |
| 438 | Mean Time to Detect Dashboard Module | SOC Operations and Metrics | Partial | MTTD endpoint computes mean detection delay from supplied first-seen and detected timestamps. |
| 439 | Mean Time to Respond Dashboard Module | SOC Operations and Metrics | Partial | MTTR endpoint computes mean response duration from supplied opened and resolved timestamps. |
| 440 | SLA Breach Alerting Module | SOC Operations and Metrics | Partial | SLA breach endpoint counts cases exceeding supplied age and SLA thresholds. |
| 441 | Case Backlog Module | SOC Operations and Metrics | Partial | Case backlog endpoint counts open and critical-open cases from supplied case records. |
| 442 | Alert Volume Analytics Module | SOC Operations and Metrics | Partial | Alert volume endpoint groups supplied alerts by severity and source. |
| 443 | Detection Quality Analytics Module | SOC Operations and Metrics | Partial | Detection quality endpoint counts enabled and noisy detections by supplied false-positive rate metadata. |
| 444 | False Positive Rate Dashboard Module | SOC Operations and Metrics | Partial | False-positive endpoint calculates reviewed alert false-positive rate from supplied alert records. |
| 445 | SOC Shift Handover Module | SOC Operations and Metrics | Partial | In-memory tenant shift handover list/create endpoints track summary and open-item metadata. |
| 446 | Hunting Notebook Module | SOC Operations and Metrics | Partial | In-memory tenant hunting notebook list/create endpoints store query and tag metadata. |
| 447 | Threat Hunting Workspace Module | SOC Operations and Metrics | Partial | Threat hunting workspace endpoint returns hunt query, tags, and pivot fields for supplied notebook context. |
| 448 | Runbook Management Module | SOC Operations and Metrics | Partial | In-memory tenant runbook list/create endpoints store trigger and step metadata. |
| 449 | Knowledge Base Module | SOC Operations and Metrics | Partial | In-memory SOC knowledge-base list/create endpoints store article and tag metadata. |
| 450 | Analyst Activity Audit Module | SOC Operations and Metrics | Partial | Analyst activity endpoint summarizes analyst action counts from supplied activity data. |
| 451 | Purple Team Simulation Module | Simulation and Validation | Partial | Purple-team simulation endpoint computes bounded risk for supplied techniques, controls, and target scope in dry-run mode. |
| 452 | Attack Simulation Module | Simulation and Validation | Partial | Attack simulation endpoint returns safe-mode risk preview for supplied attack scenarios. |
| 453 | Breach and Attack Simulation Module | Simulation and Validation | Partial | Breach-and-attack simulation endpoint requires approval outside lab scope and returns risk metadata. |
| 454 | MITRE Caldera Integration Module | Simulation and Validation | Partial | MITRE Caldera status endpoint reports configuration readiness without returning secrets. |
| 455 | Atomic Red Team Integration Module | Simulation and Validation | Partial | Atomic Red Team status endpoint reports local content readiness and dry-run execution mode. |
| 456 | Detection Validation Module | Simulation and Validation | Partial | Detection validation endpoint calculates test coverage for supplied detections and events. |
| 457 | Control Validation Module | Simulation and Validation | Partial | Control validation endpoint reports validated control counts for supplied simulation controls. |
| 458 | Sample Log Replay Module | Simulation and Validation | Partial | Sample log replay endpoint estimates replay duration from event count and EPS without executing replay. |
| 459 | Lab Scenario Module | Simulation and Validation | Partial | Lab scenarios endpoint lists supported validation scenarios for safe test environments. |
| 460 | Phishing Simulation Integration Module | Simulation and Validation | Partial | Phishing simulation status endpoint reports supported imported campaign, click, and report events. |
| 461 | Mail Security Simulation Module | Simulation and Validation | Partial | Mail security simulation status endpoint reports supported quarantine, delivery, click, and attachment events. |
| 462 | Red Team Evidence Import Module | Simulation and Validation | Partial | Red-team evidence import endpoint records evidence count and chain-of-custody metadata. |
| 463 | Detection Coverage Testing Module | Simulation and Validation | Partial | Detection coverage test endpoint reuses detection/event coverage scoring. |
| 464 | Rule Regression Testing Module | Simulation and Validation | Partial | Rule regression endpoint gates pass/fail on coverage threshold from supplied test data. |
| 465 | Security Content Testing Module | Simulation and Validation | Partial | Security content test endpoint checks that detections and test events are present and reports coverage. |
| 466 | System Health Monitoring Module | System Administration | Partial | System health endpoint reports API/database/Redis/NATS/ClickHouse check readiness. |
| 467 | Cluster Health Module | System Administration | Partial | Cluster health endpoint summarizes node count, unhealthy count, and degraded/healthy status. |
| 468 | Node Management Module | System Administration | Partial | Node management endpoint echoes node metadata and cluster health summary for supplied nodes. |
| 469 | High Availability Module | System Administration | Partial | High-availability endpoint checks minimum nodes, multi-zone placement, and healthy status. |
| 470 | Horizontal Scaling Module | System Administration | Partial | Horizontal scaling endpoint reports current nodes and scale-out readiness. |
| 471 | Load Balancer Module | System Administration | Partial | Load balancer endpoint reports Nginx-backed readiness and health path metadata. |
| 472 | Disaster Recovery Module | System Administration | Partial | Disaster recovery endpoint exposes RPO/RTO and runbook/test status metadata. |
| 473 | Configuration Management Module | System Administration | Partial | Configuration endpoints expose safe configuration sources and validate metadata without returning values. |
| 474 | Environment Setup Module | System Administration | Partial | Environment setup endpoint returns setup checklist for env, secrets, migrations, services, and validation. |
| 475 | Docker Deployment Module | System Administration | Partial | Docker deployment endpoint reports compose-file readiness. |
| 476 | Kubernetes Deployment Module | System Administration | Partial | Kubernetes deployment endpoint reports manifest requirements and recommended replicas. |
| 477 | Helm Chart Module | System Administration | Partial | Helm chart endpoint reports chart and values schema readiness. |
| 478 | Update / Upgrade Management Module | System Administration | Partial | Upgrade plan endpoint returns backup, migrate, deploy, validate, and rollback-ready steps. |
| 479 | Migration Module | System Administration | Partial | Migration status endpoint reports Alembic configuration readiness. |
| 480 | Backup Verification Module | System Administration | Partial | Backup verification endpoint reports restore-test requirement and verification status. |
| 481 | Certificate Management Module | System Administration | Partial | Certificate metadata endpoint reports common name, issuer, expiry, and rotation-due status. |
| 482 | Secrets Management Module | System Administration | Partial | Secrets metadata endpoint returns stable fingerprints only and never returns secret values. |
| 483 | Encryption Key Management Module | System Administration | Partial | Encryption key metadata endpoint returns key fingerprint and rotation policy without key material. |
| 484 | API Token Management Module | System Administration | Partial | API token endpoint returns token fingerprint only and never returns token values. |
| 485 | Integration Secrets Vault Module | System Administration | Partial | Integration vault endpoint returns secret fingerprints only and never returns secret values. |
| 486 | API Gateway Module | API, Plugin, and Developer Ecosystem | Partial | API gateway status endpoint reports FastAPI gateway, versioned prefix, and rate-limit headers. |
| 487 | Public REST API Module | API, Plugin, and Developer Ecosystem | Partial | Public REST API endpoint reports OpenAPI URL, version, and bearer auth metadata. |
| 488 | GraphQL API Module | API, Plugin, and Developer Ecosystem | Partial | GraphQL status endpoint reports REST-first readiness and GraphQL disabled state. |
| 489 | Webhook Security Module | API, Plugin, and Developer Ecosystem | Partial | Webhook security endpoint validates HMAC SHA-256 signatures without returning secret values. |
| 490 | Plugin Management Module | API, Plugin, and Developer Ecosystem | Partial | In-memory tenant plugin list/register endpoints store plugin metadata and permissions. |
| 491 | Plugin Marketplace Module | API, Plugin, and Developer Ecosystem | Partial | Plugin marketplace endpoint exposes planned connector and detection-pack catalog metadata. |
| 492 | Integration Connector Module | API, Plugin, and Developer Ecosystem | Partial | In-memory connector list/register endpoints store connector type and direction metadata. |
| 493 | Connector SDK Module | API, Plugin, and Developer Ecosystem | Partial | Connector SDK endpoint returns generated manifest metadata for connector packages. |
| 494 | Forwarder SDK Module | API, Plugin, and Developer Ecosystem | Partial | Forwarder SDK endpoint returns generated manifest metadata for forwarder packages. |
| 495 | Detection SDK Module | API, Plugin, and Developer Ecosystem | Partial | Detection SDK endpoint returns generated manifest metadata for detection packages. |
| 496 | Dashboard SDK Module | API, Plugin, and Developer Ecosystem | Partial | Dashboard SDK endpoint returns generated manifest metadata for dashboard packages. |
| 497 | Developer Documentation Module | API, Plugin, and Developer Ecosystem | Partial | Developer docs endpoint indexes README, API reference, deployment, and admin guide docs. |
| 498 | Help Center Module | API, Plugin, and Developer Ecosystem | Partial | Help center endpoint indexes getting started, ingestion, detections, incident response, and admin setup topics. |
| 499 | CLI Tool Module | API, Plugin, and Developer Ecosystem | Partial | CLI endpoint reports planned `insoctl` commands and packaging status. |
| 500 | System Audit API Module | API, Plugin, and Developer Ecosystem | Partial | System audit API endpoint reports audit log and export API coverage metadata. |
