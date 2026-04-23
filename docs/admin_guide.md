# Administrator Guide

This guide covers the current administrator workflows for the Inso SIEM sellable-MVP track.

## First Login And Tenant Bootstrap

Create the first workspace through the registration flow or seed/bootstrap process configured for the deployment. The first administrator should immediately rotate any bootstrap password, verify organization settings, and confirm production secrets were supplied through `.env`.

## User And Role Administration

Administrators can manage users and RBAC through the backend user and RBAC APIs. The current frontend has authentication and app-shell support, while deeper admin user-management UI remains a sellable-MVP follow-up.

Recommended operating model:

- Assign only required roles to each user.
- Reserve `admin` for tenant administrators.
- Use analyst roles for SOC operators.
- Use viewer/read-only roles for auditors and executives.
- Review RBAC assignments before enabling production data ingestion.

## Audit Logs

Admins can review audit records in the Audit Logs page at `/audit-logs`. The page supports outcome filtering, resource filtering, search, pagination, and CSV export.

Audit events currently cover:

- Incident create, update, delete, alert-link, and timeline-note actions.
- Alert update and acknowledge actions.

Audit expansion remains pending for users, RBAC, detections, assets, settings, and agent policy mutations.

## Deployment And Migrations

Fresh Docker deployments use `infra/postgres/init.sql` for PostgreSQL bootstrap and `infra/clickhouse/init.sql` for event storage bootstrap.

Existing deployments should run:

```bash
make migrate
```

The current Alembic migration creates `audit_logs` idempotently for existing databases.

## Security Operations

Before production exposure:

- Replace every example password and secret.
- Keep infrastructure services on private networks.
- Confirm TLS terminates at Nginx or the platform ingress.
- Confirm OpenAI or other AI provider keys are absent when cloud AI should be disabled.
- Confirm audit exports are handled as sensitive security records.

## Release Readiness

Administrators should not label a deployment sellable-MVP ready until `docs/release_checklist.md` is complete and `docs/known_issues.md` has no release-blocking items.
