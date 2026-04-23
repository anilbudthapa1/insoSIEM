# Active Cycle

## Current Cycle

Cycle: 7H

Status: completed

Current agent: Backend Engineering Agent + SOC Operations Agent + Simulation/Validation Agent + System/Admin Agent + Developer Ecosystem Agent + Testing/QA Agent

Next target: release hardening, durable persistence, UI workflows, live connector validation, RBAC/audit completion, and E2E tests.

## Cycle 4: Case Management Hardening

Status: completed

Current agent: Backend Engineering Agent + Frontend/UI Agent

## Completed Cycle 1

- Inspect full project.
- Detect tech stack.
- Create and reconcile `.agent_control/` tracker files.
- Create `sellable_mvp_checklist.md`.
- Create and update `master_backlog.md`.
- Fix or complete authentication and registration.
- Verify RBAC.
- Verify dashboard layout.
- Verify `.env.example`.
- Add professional `README.md`.
- Run build/test/start validation where possible.
- Document current status.

## Completed Cycle 2

- Added normalized event schema documentation.
- Added ingestion architecture documentation.
- Added API reference baseline.
- Added demo JSONL log samples.
- Added authenticated ingestion health API.
- Validated backend compile, backend tests, frontend build, Docker Compose config, and route registration.

## Completed Cycle 3

- Create detection rule catalog.
- Add MITRE ATT&CK mapping documentation.
- Add sample detection rules.
- Add sample test events for detections.
- Keep work file-based and non-destructive before deeper rule-engine changes.

## Current Cycle Priorities

- Build or verify case management. Completed.
- Build or verify case details page. Completed with incident detail modal.
- Build or verify incident timeline. Completed with timeline listing and note entry.
- Link alerts to cases. Completed for incident alert links with tenant validation.
- Add case status workflow. Completed for incident status updates and timeline entries.
- Add comments or notes if possible. Completed with analyst note entries.
- Add audit logs for case actions. Partial: timeline entries record workflow actions; productized audit log module remains pending.
- Update user guide. Completed in API reference for incident workflows.

## Cycle 5: Security Hardening and Audit Productization

Status: completed

Current agent: Security Hardening Agent + Testing/QA Agent

## Next Cycle Priorities

- Implement or verify productized audit log storage and read APIs. Completed for backend foundation, fresh bootstrap schema alignment, and Alembic migration scaffold.
- Add audit coverage for incident create/update/link/timeline actions. Completed for incident mutation audit writes.
- Add audit export and admin UI. Completed for CSV export and `/audit-logs` admin page.
- Expand route-contract and service tests for incident tenant isolation. Completed for incident-alert link service behavior and route-method contracts.
- Review hardcoded-secret exposure and secure defaults. In progress: `.env.example` compatibility aliases added; full secret scan remains pending.

## Cycle 6: Documentation and Release Gates

Status: in progress

Current agent: Documentation Agent + Release Manager Agent

## Current Cycle Priorities

- Add deployment guide. Completed.
- Add known issues. Completed.
- Add release checklist. Completed.
- Update README references. Completed.
- Continue with admin/analyst guides and schema drift remediation. Admin and analyst guides completed; schema drift remediation is ongoing.

## Cycle 7: App-Guide Module Expansion to 24%

Status: completed

Current agent: Backend Engineering Agent + Data Pipeline Agent + Testing/QA Agent

## Completed Cycle 7A

- Implemented collector modules 71-75 with tenant-scoped agent policy APIs.
- Expanded ingestion with REST, webhook, batch upload, auth status, rate policy, queue status, dead-letter, malformed-event, and duplicate-check endpoints.
- Exposed parser and normalization APIs with JSON, syslog, CEF, CSV, XML, LEEF, regex, and Grok coverage.
- Added search CSV/JSON export endpoints.
- Added route-contract and parser/ingestion service tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `120/500 = 24.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Complete remaining normalization/enrichment gaps from modules 125-135.
- Start storage and indexing modules 136-160 with retention, tiering, and ClickHouse lifecycle controls.
- Add runtime integration tests for ingestion queue, dead-letter replay, search export, and parser failure workflows.

## Cycle 7B: App-Guide Module Expansion to 34%

Status: completed

Current agent: Backend Engineering Agent + Data Pipeline Agent + Testing/QA Agent

## Completed Cycle 7B

- Added enrichment context APIs for identity, ASN, DNS reverse lookup, threat intelligence, vulnerability, cloud, MITRE ATT&CK, and kill-chain context.
- Added storage and indexing policy APIs for retention, tiering, indexing, immutable windows, compression/encryption controls, usage, optimization, sampling, pre-ingestion filtering, and cost control.
- Expanded search APIs with capability reporting, InsoQL parsing, SPL/KQL/SQL/NL translation, deterministic query generation/explanation, saved/scheduled search drafts, history, templates, performance, permissions, federated readiness, and archive readiness.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `170/500 = 34.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Implement backup/restore and PDF export before moving deeper into detection modules.
- Expand detection engineering modules 186-209 with Sigma import/export/conversion, threshold testing, simulation, coverage gap analysis, and MITRE heatmap wiring.
- Replace in-memory saved/scheduled search drafts with database-backed tenant persistence.

## Cycle 7C: App-Guide Module Expansion to 44%

Status: completed

Current agent: Backend Engineering Agent + Detection Engineering Agent + Testing/QA Agent

## Completed Cycle 7C

- Added compact PDF evidence export for search results.
- Expanded detection engineering APIs for Sigma import/export/conversion, custom rule validation, threshold/correlation/sequence/statistical/anomaly/ML/behavioral previews, hunt query drafting, simulation, benchmarking, version visibility, detection-as-code status, Git status, approval workflow, coverage gaps, MITRE coverage, kill-chain mapping, and false-positive analytics.
- Expanded alert workflow APIs for generation preview, severity/risk scoring, risk policy, deduplication, grouping, suppression, escalation, notification preview, comments, evidence, SLA, timeline, tuning, noise reduction, priority queue, review queue, and review decisions.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `220/500 = 44.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Implement alert audit trail module 230 with persistent audit/event linkage.
- Expand incident and case modules 231-250 using the existing incident service without duplicating case-management code.
- Replace in-memory alert comments/evidence/reviews/suppression/escalation policies with tenant-scoped database persistence.

## Cycle 7D: App-Guide Module Expansion to 54%

Status: completed

Current agent: Backend Engineering Agent + AI SOC Agent + Testing/QA Agent

## Completed Cycle 7D

- Added alert audit-trail workflow endpoint with database-audit readiness and in-memory workflow event visibility.
- Expanded incident/case APIs for capabilities, severity model, case aliases, analyst notes, kill-chain timeline, evidence, chain-of-custody, RCA, affected assets/users, IOCs, collaboration, post-incident review, report metadata, executive summary, and closure workflow.
- Expanded AI-native SOC APIs for alert summarization, triage, severity recommendation, false-positive scoring, investigation help, RCA, timeline generation, threat hunting, rule/Sigma/query/report/compliance/playbook/runbook assistance, noise reduction, correlation, evidence citations, hallucination checks, prompt audit, guardrails, privacy redaction, model selection, provider status, and RAG context.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `270/500 = 54.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Implement SOC knowledge base module 280 and threat-intelligence modules 281-299.
- Continue toward modules 300-329 with reputation scoring, STIX/TAXII/MISP-style feed readiness, and entity relationship mapping.
- Replace in-memory incident evidence/custody/review/collaboration and AI prompt-audit/guardrail state with tenant-scoped database persistence.

## Cycle 7E: App-Guide Module Expansion to 64%

Status: completed

Current agent: Backend Engineering Agent + Threat Intelligence Agent + SOAR Agent + Testing/QA Agent

## Completed Cycle 7E

- Added SOC knowledge-base article and search endpoints under AI safe mode.
- Added threat-intelligence APIs for feeds, IOCs, IOC matching, expiry, confidence scoring, IP/domain/URL/hash/email reputation, MISP/VirusTotal/AbuseIPDB/OTX/STIX-TAXII readiness, feed deduplication, threat actors, malware families, campaigns, and dashboard summary.
- Added SOAR APIs for playbooks, builder preview, sandbox testing, manual/automated action preview, approvals, webhook/email/Slack/Teams/ticket previews, Jira/ServiceNow/EDR readiness, firewall blocklist export, endpoint/user/password/IP/domain/host actions, automation audit, safety controls, rate limits, and rollback preview.
- Added asset inventory summary, asset discovery preview, cloud discovery preview, and attack-surface discovery preview.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `320/500 = 64.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Continue modules 330-379 for asset risk, ownership, tagging, criticality, user/identity inventory, identity provider integrations, UEBA, and security analytics packs.
- Replace in-memory threat-intel, SOAR, and knowledge-base state with tenant-scoped database persistence.
- Add UI workflows for threat intelligence, SOAR approvals, and asset discovery.

## Cycle 7F: App-Guide Module Expansion to 74%

Status: completed

Current agent: Backend Engineering Agent + Asset/Identity Agent + Security Analytics Agent + Testing/QA Agent

## Completed Cycle 7F

- Added asset risk model/score, ownership policy, tagging preview, and criticality model/score endpoints.
- Added identity and UEBA APIs for user inventory, identity inventory, AD/LDAP/Entra/Okta/cloud identity readiness, privileged/service account monitoring, IAM risk, user/entity behavior, baseline learning, peer groups, impossible travel, MFA fatigue, and password spraying.
- Added security analytics APIs for authentication, PowerShell, process tree, file integrity, registry, USB, remote access, VPN, DNS, network flow, packet metadata, WAF, web attacks, database attacks, cloud misconfiguration, lateral movement, privilege escalation, data exfiltration, ransomware, command and control, insider threat, malware behavior, credential theft, persistence, defense evasion, AWS, Azure, GCP, and CloudTrail.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `370/500 = 74.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Continue modules 380-429 for cloud/container/DevSecOps, compliance, reporting, SOC metrics, and administration analytics.
- Replace in-memory identity baseline/inventory state with tenant-scoped database persistence.
- Add UI workflows for identity risk, UEBA findings, and security analytics packs.

## Cycle 7G: App-Guide Module Expansion to 84%

Status: completed

Current agent: Backend Engineering Agent + Cloud/DevSecOps Agent + Vulnerability/Compliance Agent + Testing/QA Agent

## Completed Cycle 7G

- Added cloud/container/DevSecOps APIs for Azure Activity Log, GCP audit, cloud IAM/storage/network/workload, container runtime, Kubernetes, Docker, CI/CD, GitHub/GitLab readiness, secrets detection, and DevSecOps dashboard foundations.
- Added vulnerability/exposure APIs for scanner readiness, Nessus/OpenVAS/Qualys status, vulnerability context, CVE mapping, exploitability, EPSS, asset vulnerability risk, patch status, exposure dashboard, attack path, entity graph, investigation graph, and attack-surface risk.
- Added compliance/governance APIs for compliance dashboard, framework mappings, audit report metadata, control evidence metadata, policy metadata, risk register, gap analysis, scheduled reports, report templates, executive dashboard, board reports, and data residency controls.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `420/500 = 84.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Continue modules 430-480 for privacy, SOC operations and metrics, simulation/validation, and system administration.
- Replace in-memory compliance policy and data-residency state with tenant-scoped database persistence.
- Add UI workflows for cloud security, vulnerability exposure, and compliance dashboards.

## Cycle 7H: App-Guide Module Completion to 100%

Status: completed

Current agent: Backend Engineering Agent + SOC Operations Agent + Simulation/Validation Agent + System/Admin Agent + Developer Ecosystem Agent + Testing/QA Agent

## Completed Cycle 7H

- Closed missing auth-foundation rows 1-5 in the app-guide tracker and added password reset request/confirm API foundations.
- Closed older ingestion/storage gaps for gRPC ingestion, syslog TLS, Kafka ingestion, and backup/restore readiness.
- Added privacy management APIs for policy posture and redaction preview.
- Added SOC operations APIs for overview dashboards, custom dashboards, widgets, sharing, analyst workload, metrics, KPIs, MTTD, MTTR, SLA breaches, case backlog, alert volume, detection quality, false-positive rate, handovers, hunting notebooks, workspaces, runbooks, knowledge base, and analyst activity audit.
- Added simulation and validation APIs for purple-team, attack, breach-and-attack, Caldera, Atomic Red Team, detection/control validation, sample replay, lab scenarios, phishing/mail simulation readiness, red-team evidence, coverage, regression, and content testing.
- Added system administration APIs for health, cluster/nodes, HA, scaling, load balancer, DR, configuration, environment setup, Docker/Kubernetes/Helm readiness, upgrades, migrations, backup verification, certificates, secrets, encryption keys, API tokens, and integration secrets vault.
- Added developer ecosystem APIs for API gateway, public REST, GraphQL status, webhook security, plugins, marketplace, connectors, SDK manifests, developer docs, help center, CLI metadata, and system audit API metadata.
- Added route-contract and helper regression tests.
- Updated `docs/APP_GUIDE_COMPLIANCE.md` to exactly `500/500 = 100.0%` implemented-or-partial coverage.

## Next Cycle Priorities

- Convert in-memory and preview endpoints into database-backed workflows with full audit and granular RBAC.
- Add UI workflows for the remaining API foundations.
- Validate live integrations and add E2E tests against PostgreSQL, Redis, NATS, ClickHouse, cloud/scanner connectors, and deployment packaging.
