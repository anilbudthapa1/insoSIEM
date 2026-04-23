# Release Checklist

Use this checklist before labeling the platform sellable-MVP ready.

## Product Gates

- Register, login, logout, refresh, and MFA flows are verified.
- Admin user management is verified.
- RBAC permissions are enforced on user-facing and API workflows.
- Dashboard, search, alerts, incidents, assets, detections, audit logs, settings, and AI safe mode are functional.
- Cases/incidents can be created from alerts and retain timeline evidence.
- Audit logs are persisted, readable by admins, exportable, and populated by all mutating workflows.

## Security Gates

- No real hardcoded secrets exist in tracked files.
- Production refuses or loudly blocks unsafe default secrets.
- Tenant isolation is covered by tests for sensitive resources.
- Rate limits exist for auth and high-risk mutation endpoints.
- AI endpoints redact sensitive content and cite evidence.
- Threat model and security findings are reviewed.

## Data Gates

- Raw ingestion, normalized event schema, parser selection, deduplication, and malformed-event handling are verified.
- Search works across realistic sample logs.
- Detection rules have tests, MITRE mapping, severity, and false-positive notes.
- Audit logs and incident timelines preserve chain-of-custody evidence.

## Quality Gates

- Backend compile passes.
- Backend tests pass.
- Frontend production build passes.
- Docker Compose config validates.
- Migration history is present and upgrade path is tested.
- Known issues are documented and release blockers are closed.

## Documentation Gates

- README is current.
- Deployment guide is current.
- API reference is current.
- Known issues are current.
- Admin and analyst workflow guides are available.

## Current Release Decision

Not ready for sellable MVP release. The platform has improved core SOC workflows, audit foundation, and validation coverage, but schema drift, broader audit coverage, granular RBAC enforcement, runtime integration tests, security review, and performance baselines remain open.
