# Analyst Guide

This guide covers the current SOC analyst workflows in Inso SIEM.

## Dashboard

Use the Dashboard page for a quick view of active alerts, open incidents, event trends, and recent high-priority activity. Treat it as the starting point for triage rather than the final source of evidence.

## Alert Triage

Open the Alerts page to review alert severity, status, source, assignment, and occurrence count. Select an alert to open details.

Recommended triage flow:

1. Review severity, source, MITRE tags, and raw event context.
2. Acknowledge the alert when a human has accepted triage ownership.
3. Mark obvious benign activity as false positive only after validating the source and context.
4. Create an incident from the alert when multiple steps, evidence, or handoff will be needed.
5. Use AI analysis as a triage aid, not as the sole source of truth.

## Incident Workflow

Open the Incidents page to review active investigations. Select an incident to open the detail modal.

The incident detail workflow supports:

- Status updates.
- Timeline review.
- Analyst notes.
- Linked alert visibility.
- Created, updated, resolved, and linked-alert summary fields.

Use timeline notes to record material investigation steps such as containment actions, evidence reviewed, customer impact, and handoff context.

## Search Workflow

Use Search to investigate raw and normalized events. Build narrow queries first, then widen time ranges or fields when needed. Preserve event IDs, alert IDs, and incident IDs in notes when evidence matters for chain of custody.

## Audit Evidence

Admins can review Audit Logs for selected SOC mutations. Analysts should assume incident and alert workflow actions are recorded and should write concise, factual notes.

## AI Safe Use

AI responses are safe-mode aids in the current MVP track. Analysts must verify AI suggestions against real events, alerts, assets, and incident evidence before taking action.

## Current Limitations

Some workflows remain in progress:

- Agent Fleet, AI Assistant workspace, and Settings screens are still placeholders.
- Audit coverage is not yet complete across every mutating API.
- Full database-backed integration tests and schema drift cleanup remain open.
