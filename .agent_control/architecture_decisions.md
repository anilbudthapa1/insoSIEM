# Architecture Decisions

## ADR-001: Orchestrated Specialist Workflow

Status: Accepted

Use a Master Orchestrator Agent to sequence specialist work. Product and architecture planning must precede major implementation. Builder agents should not independently create duplicate modules or rewrite shared foundations.

## ADR-002: SIEM Data Foundation Before AI Expansion

Status: Accepted

AI features must depend on real logs, alerts, cases, and evidence references. The platform must prioritize ingestion quality, parser reliability, normalization, deduplication, replay safety, tenant isolation, and auditability before advanced AI recommendations.

