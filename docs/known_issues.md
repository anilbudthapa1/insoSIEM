# Known Issues

This file tracks release-blocking and non-blocking issues discovered during the autonomous build cycles.

## Release Blocking

| ID | Area | Issue | Impact | Next Step |
|---|---|---|---|---|
| KI-001 | Database schema | Several ORM models may still differ from the comprehensive `infra/postgres/init.sql` schema. Audit, alert, and incident core column names were aligned in Cycle 6B. | Runtime CRUD against a fresh Docker database may fail for modules whose ORM columns do not match bootstrap SQL. | Continue model/schema drift review for assets, agents, detections, RBAC, and platform modules. |
| KI-002 | Audit coverage | Audit writes currently cover incident mutations, while many other mutating APIs are not yet audited. | Compliance evidence is incomplete. | Add audit writes or decorators to users, RBAC, alerts, detections, assets, settings, and agent policy mutations. |
| KI-003 | RBAC breadth | Some SOC routes require authentication but do not yet enforce granular `resource:action` permissions. | Users may see or call workflows beyond intended role boundaries. | Apply `require_permission` consistently and add permission tests. |
| KI-004 | Frontend chunk size | Vite reports a JavaScript chunk larger than 500 kB. | Not a functional failure, but it can slow first load. | Add route-level code splitting and manual chunks. |
| KI-005 | Runtime integration tests | Current tests are mostly route-contract and service-unit tests, not full database integration tests. | Schema drift and transaction issues can escape CI. | Add PostgreSQL-backed integration tests for auth, audit, incidents, alerts, and RBAC. |

## Non-Blocking

| ID | Area | Issue | Impact | Next Step |
|---|---|---|---|---|
| KI-006 | UI | Agent Fleet, AI Assistant, and Settings still use placeholder screens. | Some sellable workflows are not user-complete. | Replace placeholders with workflow-specific pages. |
| KI-007 | Documentation | Admin and analyst user guides are still thin. | Buyers/operators lack full runbooks. | Add admin guide, analyst guide, and troubleshooting guide. |
| KI-008 | Performance | No load-test baseline exists for ingestion, search, or dashboard queries. | Capacity claims are not defensible. | Add repeatable load-test scenarios and thresholds. |
| KI-009 | Security review | Full threat model and AppSec review remain in progress. | Release risk cannot be fully assessed. | Complete threat model, secure coding checklist, and remediation log. |
