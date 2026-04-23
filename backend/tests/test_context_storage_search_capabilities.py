from app.modules.enrichment.router import (
    KillChainContextRequest,
    _ip_summary,
    _kill_chain_phase,
)
from app.modules.search.router import _language_to_insoql
from app.modules.storage.router import RetentionPolicyRequest, _tier_profiles


def test_enrichment_helpers_build_network_and_kill_chain_context() -> None:
    private_summary = _ip_summary("10.0.0.5")
    public_summary = _ip_summary("8.8.8.8")

    assert private_summary["valid"] is True
    assert private_summary["risk_hint"] == "internal"
    assert public_summary["valid"] is True
    assert public_summary["risk_hint"] == "external"

    phase = _kill_chain_phase(KillChainContextRequest(event_action="credential dump", mitre_tactics=["TA0006"]))

    assert phase == "credential_access"


def test_storage_profiles_cover_expected_tiers_and_retention() -> None:
    tiers = _tier_profiles()
    policy = RetentionPolicyRequest(hot_days=30, warm_days=90, cold_days=365, archive_days=2555)

    assert {"hot", "warm", "cold", "archive"}.issubset(tiers)
    assert policy.hot_days + policy.warm_days == 120
    assert tiers["archive"]["engine"] == "immutable_object_storage"


def test_search_query_translation_is_safe_and_deterministic() -> None:
    spl = _language_to_insoql("index=windows sourcetype=powershell failed", "spl")
    kql = _language_to_insoql("event.severity == high and source == firewall", "kql")
    natural = _language_to_insoql("show high severity failed login events", "natural")

    assert "source:windows" in spl["translated_query"]
    assert kql["parsed"]["field_filters"]["event.severity"] == "high"
    assert natural["parsed"]["field_filters"]["event.action"] == "failed_login"
    assert natural["parsed"]["field_filters"]["event.severity"] == "high"
