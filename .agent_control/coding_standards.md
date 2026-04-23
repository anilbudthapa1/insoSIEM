# Coding Standards

## Shared Rules

- Preserve existing working functionality.
- Extend existing modules before creating new parallel modules.
- Validate all inputs with Pydantic on the backend and typed validation on the frontend where practical.
- Enforce authentication, tenant isolation, and RBAC on protected APIs.
- Never hardcode secrets, tokens, private keys, passwords, or customer data.
- Store sensitive configuration through environment variables or encrypted secret storage.
- Add structured logs for security-relevant events without leaking sensitive payloads.
- Add tests or route-contract coverage for new backend APIs.
- Update documentation and tracker files after every cycle.
- Keep files readable; split oversized files into smaller services, schemas, and routers.

## Specialist Ownership

- Product Manager Agent owns prioritization and acceptance criteria, not code.
- Architecture Agent owns boundaries, contracts, and design decisions.
- Backend Agent owns APIs, services, database access, migrations, workers, and tests.
- Frontend/UI Agent owns UX, pages, components, client APIs, and visual consistency.
- Data Pipeline Agent owns ingestion, parsing, normalization, enrichment, deduplication, replay, and health.
- AI SOC Agent owns AI features only after evidence and data foundations exist.
- Security Hardening Agent reviews and fixes security risks.
- QA Agent expands test strategy and regression checks.
- Performance Agent measures and optimizes bottlenecks.
- DevOps Agent owns deployment, health checks, backup, and production operations.
- Documentation Agent owns customer, admin, developer, and security docs.
- Release Manager Agent owns release gates, changelog, known issues, and version plan.

