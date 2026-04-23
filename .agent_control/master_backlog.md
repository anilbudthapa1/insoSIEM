# Master Backlog

This backlog is controlled by the Master Orchestrator Agent. Work must move through the specialist-agent sequence instead of being implemented randomly.

## Workflow Order

1. Product Manager Agent
2. Architecture Agent
3. Backend Engineering Agent, Frontend/UI Agent, and Data Pipeline/Ingestion Agent
4. Detection Engineering Agent and AI SOC Agent
5. Security Hardening Agent
6. Testing/QA Agent
7. Performance Agent
8. DevOps/Deployment Agent
9. Documentation Agent
10. Release Manager Agent

## Current Priority

| ID | Owner Agent | Task | Priority | Status | Acceptance Criteria |
|---|---|---|---|---|---|
| ORCH-001 | Master Orchestrator | Create shared agent control folder and operating rules | P0 | Completed | `.agent_control/` exists with backlog, active agent, handoff, standards, decisions, and release status files. |
| PM-001 | Product Manager | Build product roadmap and market gap analysis | P0 | Completed | `product_roadmap.md`, `market_gap_analysis.md`, `feature_priority_matrix.md`, and `release_plan.md` exist and prioritize SIEM data foundation before AI expansion. |
| ARCH-001 | Architecture | Define scalable SIEM architecture and module boundaries | P0 | Completed | Architecture docs define ingestion, storage, parser, normalization, search, AI, RBAC, audit, and frontend boundaries. |
| DATA-001 | Data Pipeline | Define normalized event schema and parser catalog | P0 | Completed | Normalized schema, parser catalog, ingestion health model, deduplication, replay, and backpressure strategy are documented. |
| BE-001 | Backend | Implement highest-priority architecture-approved backend gaps | P0 | In progress | Backend changes include validation, tenant isolation, RBAC, auditability, and tests. |
| FE-001 | Frontend/UI | Improve commercial SOC workflows and empty/loading/error states | P1 | Pending | UI changes improve analyst workflows without clutter and remain responsive. |
| SEC-001 | Security Hardening | Threat model and first security review | P0 | In progress | Findings, fixes, threat model, and secure coding checklist are created and actionable issues are fixed. |
| QA-001 | Testing/QA | Create regression test strategy and expand route/API coverage | P0 | In progress | Test plan and first meaningful coverage expansion are complete. |
| PERF-001 | Performance | Establish ingestion/search/dashboard performance baseline | P1 | Pending | Baseline, bottleneck report, optimization log, and load test plan exist. |
| DOC-001 | Documentation | Write install/admin/developer docs for sellable usage | P1 | Pending | Documentation covers setup, admin, user workflows, architecture, API, troubleshooting, and security model. |
| REL-001 | Release Manager | Define release quality gates | P1 | Pending | Changelog, checklist, known issues, and version plan exist with clear release criteria. |
| DET-001 | Detection Engineering | Create initial detection catalog, MITRE mapping, sample detections, and test events | P0 | Completed | Detection artifacts exist under `detections/` and docs explain rule purpose, data source, logic, false positives, and MITRE mapping. |
| CASE-001 | Backend + Frontend | Harden case management, incident details, timelines, alert links, and audit notes | P0 | Completed | Case/incident APIs and UI support analyst workflow with status, timeline, linked alerts, notes, and safe empty/error states. |
| DATA-002 | Backend + Data Pipeline | Expand collector, ingestion, parser, normalization, and search export module coverage to 24% | P0 | Completed | `docs/APP_GUIDE_COMPLIANCE.md` shows 120/500 implemented-or-partial modules and backend route/service tests pass. |
| DATA-003 | Backend + Data Pipeline | Continue modules 125-160: enrichment, storage, retention, indexing, and lifecycle controls | P0 | Completed | Enrichment/storage APIs have tenant-safe contracts, validation, tests, and updated module coverage. |
| DATA-004 | Backend + Data Pipeline + Detection Engineering | Expand PDF export, detection engineering, and alert workflow modules 180-229 | P0 | Completed | `docs/APP_GUIDE_COMPLIANCE.md` shows 220/500 implemented-or-partial modules and backend route/helper tests pass. |
| CASE-002 | Backend + Security Hardening + Testing/QA | Continue alert audit trail and incident/case modules 230-250 | P0 | Completed | Alert audit and incident/case APIs reuse existing tenant-safe services, route contracts pass, and module coverage is updated. |
| AI-001 | Backend + AI SOC + Testing/QA | Add AI-native SOC safe-mode modules 251-279 | P0 | Completed | Deterministic AI SOC assistant APIs cover triage, investigation, reporting, guardrails, redaction, provider status, and RAG readiness with route/helper tests. |
| TI-001 | Backend + Threat Intelligence + SOAR + Testing/QA | Continue SOC knowledge base, threat-intelligence, SOAR, and asset discovery modules 280-329 | P0 | Completed | Knowledge-base, threat-intel, SOAR, and asset discovery APIs expose tenant-safe workflows with route/helper tests and updated coverage. |
| ASSET-001 | Backend + Asset/Identity + Testing/QA | Continue asset risk, ownership, identity, UEBA, and analytics modules 330-379 | P0 | Completed | Asset/identity/UEBA/security-analytics APIs reuse existing tenant-safe routes where possible, route/helper tests pass, and module coverage is updated. |
| CLOUD-001 | Backend + Cloud/DevSecOps + Vulnerability/Compliance + Testing/QA | Continue cloud, container, DevSecOps, vulnerability, compliance, reporting, and data residency modules 380-429 | P0 | Completed | Cloud/container/vulnerability/compliance/reporting APIs expose tenant-safe readiness and workflow contracts with tests and updated coverage. |
| SOCOPS-001 | Backend + SOC Operations + Simulation/Validation + System Admin + Developer Ecosystem + Testing/QA | Complete privacy, SOC operations, metrics, simulation, system administration, and developer ecosystem modules 430-500 plus older app-guide gaps | P0 | Completed | Privacy/SOC operations/simulation/admin/developer APIs expose tenant-safe workflow contracts with tests and updated coverage. |
| RELHARD-001 | Security Hardening + Frontend/UI + DevOps + Testing/QA + Release Manager | Convert 100% app-guide API foundation coverage into sellable release readiness | P0 | Next | Durable persistence, live connector validation, UI workflows, granular RBAC, audit coverage, E2E tests, performance baselines, and security review gates are complete. |

## Product Foundation Rule

AI SOC work depends on clean, normalized, deduplicated, tenant-safe, evidence-preserving data. Do not prioritize AI expansion ahead of ingestion quality, parser quality, schema normalization, audit trails, and search reliability.
