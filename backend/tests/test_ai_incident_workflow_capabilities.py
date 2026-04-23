from types import SimpleNamespace

from app.modules.ai.router import _query_from_intent, _severity_from_terms
from app.modules.ai.redaction import redact_event
from app.modules.incidents.router import _kill_chain_from_incident


def test_ai_severity_and_query_helpers_are_deterministic() -> None:
    assert _severity_from_terms(["credential", "lateral"]) == "high"
    assert _severity_from_terms(["ransomware"]) == "critical"
    assert _query_from_intent("failed login from external host") == "event.category:authentication event.outcome:failure"


def test_ai_privacy_redaction_masks_email_and_ip_context() -> None:
    event = {"user": "analyst@example.com", "source": {"ip": "198.51.100.10"}}

    redacted = redact_event(event, redact_emails=True, redact_ips=True)

    assert redacted["user"] == "[EMAIL_REDACTED]"
    assert redacted["source"]["ip"] == "[IPv4_REDACTED]"


def test_incident_kill_chain_timeline_marks_observed_phases() -> None:
    incident = SimpleNamespace(severity="critical")
    timeline = [SimpleNamespace(event_type="status_change"), SimpleNamespace(event_type="note")]

    phases = _kill_chain_from_incident(incident, timeline)

    assert phases[0]["phase"] == "reconnaissance"
    assert phases[0]["status"] == "observed"
    assert any(phase["status"] == "needs_evidence" for phase in phases)
