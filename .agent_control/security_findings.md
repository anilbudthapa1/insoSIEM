# Security Findings

## Initial Review Notes

- Authentication has JWT access tokens, refresh token persistence, logout revocation, and MFA primitives.
- Registration was missing from the public auth flow and is being added as a tenant bootstrap endpoint with rate limiting and password length enforcement.
- RBAC APIs exist and admin-only routes use `require_admin`.
- Full AppSec review is pending under the Security Hardening Agent.

## 2026-04-22 Case Workflow Review

- Fixed incident-alert linking so both incident and alert are verified against the authenticated user's tenant before a link is created.
- Fixed create-from-alert workflow so submitted `alert_ids` are linked instead of ignored.
- Added an audit module with model, service, admin read APIs, and incident mutation audit writes.
- Aligned the audit ORM to the existing PostgreSQL bootstrap schema and added an Alembic scaffold plus an idempotent audit-log migration for existing databases.
- Added service-level tenant isolation regression tests for incident-alert linking.
- Added audit writes for alert update and acknowledge mutations.
- Remaining finding: full audit coverage for users, RBAC, detections, assets, settings, and agent policy mutations is still pending.

## 2026-04-22 Cycle 7G Security Notes

- Added a secrets detection endpoint that returns redacted fingerprints only and never returns matched secret values.
- Added data residency conflict detection for allowed/restricted region overlap and primary-region validation.
- Added tenant IDs to cloud-security, vulnerability, and compliance API responses through authenticated token context.
- Remaining finding: new cloud, scanner, and compliance APIs are contract foundations; live connectors, durable policy state, RBAC-specific permissions, and full audit coverage still require hardening before sellable release.

## 2026-04-22 Cycle 7H Security Notes

- Added password reset request/confirm API foundation that stores hashed reset tokens in Redis, does not reveal account existence, and revokes refresh sessions after reset.
- Added privacy posture APIs for redaction policy, data-subject request window, consent, retention basis, and sensitive field handling.
- Added system-admin secret, encryption key, API token, and integration vault metadata APIs that return stable fingerprints only and never return secret material.
- Added webhook HMAC SHA-256 validation endpoint for developer integrations.
- Remaining finding: most new mutating preview APIs still need granular RBAC dependencies, durable audit writes, and persistence hardening before release readiness.
