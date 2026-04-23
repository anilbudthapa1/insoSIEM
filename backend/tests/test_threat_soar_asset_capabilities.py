from app.modules.assets.router import _asset_exposure_score, _cidr_size
from app.modules.playbooks.router import _action_risk_score, _approval_required
from app.modules.threat_intel.router import _indicator_type, _reputation_score


def test_threat_indicator_typing_and_reputation_are_deterministic() -> None:
    assert _indicator_type("198.51.100.10") == "ip"
    assert _indicator_type("https://evil.example/login") == "url"
    assert _indicator_type("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa") == "hash"
    assert _reputation_score("evil.example", "domain") == 90
    assert _reputation_score("example.org", "domain") == _reputation_score("example.org", "domain")


def test_soar_action_risk_requires_approval_for_high_risk_actions() -> None:
    assert _action_risk_score("isolate endpoint", "host-1") >= 60
    assert _approval_required("disable user", "admin@example.com") is False
    assert _approval_required("quarantine host", "server-1") is True


def test_asset_discovery_helpers_bound_cidr_and_exposure_score() -> None:
    assert _cidr_size("10.0.0.0/30") == 4
    assert _cidr_size("not-a-cidr") == 0
    assert _asset_exposure_score([22, 443], public_ip_count=2) > _asset_exposure_score([443], public_ip_count=0)
