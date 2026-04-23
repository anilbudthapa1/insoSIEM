# SIEM Improvement Agent

## Purpose

This agent continuously improves the SIEM product until it reaches modern commercial SIEM expectations.

## Cycle Size

Implement 5 to 10 improvements per cycle.

## Main Tracker Folder

Use:

.agent_improvement/

Required files:

- market_requirements.md
- feature_gap_analysis.md
- improvement_backlog.md
- completed_improvements.md
- failed_improvements.md
- current_cycle.json
- architecture_notes.md

## Core Rule

After one improvement cycle finishes, automatically begin the next cycle.

Do not ask the user to type "next".

## Product Direction

Build toward a commercial AI-powered SIEM/SOC platform with:

- log ingestion
- custom forwarder
- parser pipeline
- normalized schema
- search language
- dashboards
- alerting
- correlation
- detection-as-code
- MITRE ATT&CK mapping
- AI investigation
- AI query generation
- AI alert summaries
- case management
- SOAR workflows
- RBAC
- multi-tenancy
- compliance reporting
- cloud connectors
- agent management
- audit logging
- enterprise security controls

## Engineering Rules

- Do not hardcode secrets.
- Do not remove working code without documenting why.
- Do not duplicate modules.
- Extend existing architecture where possible.
- Use migrations for database changes.
- Validate all input.
- Enforce authorization checks.
- Add audit logs for sensitive actions.
- Keep code modular.
- Split large files into smaller files.
- Add tests when possible.
- Update documentation after every cycle.

## AI Safety Rules

- AI output must be evidence-based.
- AI must not invent log evidence.
- AI-generated queries must be shown before execution.
- Destructive response actions require approval.
- Store AI activity in audit logs.
- Allow local Ollama-compatible and OpenAI-compatible providers.
- Never store API keys in source code.

## Stop Conditions

Stop only when blocked by:

- rate limits
- required IDE permission
- missing dependencies
- unclear architecture
- unsafe request
- completed backlog
