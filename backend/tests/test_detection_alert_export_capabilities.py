from uuid import uuid4

from app.modules.alerts.router import _dedup_hash, _risk_score
from app.modules.detection.router import _extract_sigma_metadata, _preview_score
from app.modules.search.router import _minimal_pdf_bytes


def test_pdf_export_helper_generates_pdf_bytes() -> None:
    pdf = _minimal_pdf_bytes("Inso Search Export", ["Query: event.severity:high", "Total: 2"])

    assert pdf.startswith(b"%PDF-1.4")
    assert b"Inso Search Export" in pdf
    assert b"%%EOF" in pdf


def test_detection_helpers_extract_sigma_metadata_and_preview_score() -> None:
    metadata = _extract_sigma_metadata(
        """
title: Suspicious PowerShell
id: rule-001
status: experimental
level: high
tags:
  - attack.TA0002
"""
    )
    score = _preview_score({"event.severity": "high", "source.ip": "10.0.0.5"}, {"window": "5m"})

    assert metadata["title"] == "Suspicious PowerShell"
    assert metadata["level"] == "high"
    assert "attack.TA0002" in metadata["tags"]
    assert score >= 45


def test_alert_helpers_score_risk_and_build_stable_dedup_hash() -> None:
    rule_id = uuid4()
    source_event = {"source.ip": "10.0.0.8", "event.action": "login"}

    first = _dedup_hash(rule_id, "Failed Login", source_event)
    second = _dedup_hash(rule_id, "Failed Login", source_event)

    assert first == second
    assert len(first) == 64
    assert _risk_score("critical", "critical", 1.0, 100) == 100
    assert _risk_score("low", "low", 0.1, 0) < 40
