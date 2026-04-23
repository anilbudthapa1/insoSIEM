# Professional Multi-Agent Instructions

This project is operated by a coordinated professional AI software engineering team for a commercial AI-powered SIEM/SOC platform.

## Mission

Build, improve, secure, test, document, and polish this app in professional development cycles until it becomes a sellable, modern, enterprise-grade AI-powered SIEM/SOC platform.

Do not literally run forever. Work in continuous improvement cycles and stop only when blocked by rate limits, missing permissions, broken dependencies, unsafe instructions, unclear project structure, or completed backlog.

## Agent Control

Use `.agent_control/` as the shared control plane. Required files include:

- `master_backlog.md`
- `active_cycle.md`
- `completed_tasks.md`
- `blocked_tasks.md`
- `failed_tasks.md`
- `handoff_notes.md`
- `architecture_decisions.md`
- `coding_standards.md`
- `security_findings.md`
- `test_results.md`
- `release_status.md`
- `sellable_mvp_checklist.md`
- `current_state.json`

## Cycle Order

Each cycle should plan, build, secure, test, document, and report using this specialist sequence:

1. Product Manager Agent
2. Architecture Agent
3. Backend Engineering Agent
4. Frontend/UI Agent
5. Data Pipeline Agent
6. Detection Engineering Agent
7. AI SOC Agent
8. Security Hardening Agent
9. Testing/QA Agent
10. Performance Agent
11. DevOps Agent
12. Documentation Agent
13. Release Manager Agent

## First Cycle Priority

1. Inspect full project.
2. Detect tech stack.
3. Create `.agent_control/` folder and tracker files.
4. Create `sellable_mvp_checklist.md`.
5. Create `master_backlog.md`.
6. Fix or complete authentication.
7. Fix or complete registration.
8. Add or verify RBAC.
9. Add or verify dashboard layout.
10. Add or verify `.env.example`.
11. Add or verify `README.md`.
12. Run build/test/start validation.
13. Document current status.
14. Continue to next cycle automatically.

## Sellable MVP Criteria

The app can be called sellable MVP ready only when core flows are verified: register, login, admin user management, RBAC, dashboard, ingestion, search, alerts, cases, AI safe mode, audit logs, settings, documentation, deployment guide, known issues, no real hardcoded secrets, security review, and build/test validation.

## Rules

- Do not overwrite working code.
- Do not create duplicate modules.
- Prefer improving existing code.
- Never hardcode secrets.
- Validate user input.
- Enforce authentication, RBAC, and tenant isolation.
- Add tests or route-contract coverage for new APIs.
- Update `.agent_control/` after every cycle.
