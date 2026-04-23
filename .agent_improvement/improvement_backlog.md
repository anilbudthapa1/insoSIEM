# Improvement Backlog

| ID | Feature | Priority | Business Value | Technical Value | Dependencies | Likely Files | Acceptance Criteria |
|---|---|---|---|---|---|---|---|
| IMP-001 | Improvement agent tracker | P0 | Makes long-running product work resumable | Adds durable planning state | None | `.agent_improvement/*`, `IMPROVEMENT_AGENT.md` | Tracker files exist and current cycle state is recorded. |
| IMP-002 | Saved searches API | P0 | Analysts can preserve reusable investigations | Uses existing org settings safely | Auth, org settings | `backend/app/modules/search/*` | Users can list, create, and delete tenant-scoped saved searches. |
| IMP-003 | Query history API | P0 | Analysts can recover recent investigations | Captures search usage without new migration | Search API | `backend/app/modules/search/*` | Searches are recorded and recent history can be listed per tenant. |
| IMP-004 | InsoQL validation API | P1 | Safer query workflow before execution | Exposes parser output and warnings | Query parser | `backend/app/modules/search/*` | Endpoint returns parsed filters, text search, and safety warnings. |
| IMP-005 | Route contract coverage | P1 | Prevents regressions in new product APIs | Extends existing contract test | Existing tests | `backend/tests/test_app_contract.py` | New routes are included in expected path set. |
| IMP-006 | AI provider tenant settings | P1 | Enterprise customers can choose OpenAI/Ollama/custom | Prepares provider abstraction | AI module, org settings | `backend/app/modules/ai/*` | Tenant-safe settings endpoint without storing raw API keys. |
| IMP-007 | AI audit records | P1 | Compliance-ready AI usage trail | Evidence traceability | Audit/storage | `backend/app/modules/ai/*` | AI requests expose evidence refs and write audit metadata. |
| IMP-008 | Detection versioning | P1 | Safer detection-as-code operations | Enables rollback | Detection module | `backend/app/modules/detection/*` | Rule versions can be listed and restored. |

