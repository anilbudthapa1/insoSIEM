from app.modules.assets.router import AssetCriticalityRequest, _asset_risk_score, _criticality_from_context
from app.modules.identity.router import ImpossibleTravelRequest, _identity_risk_score, _impossible_travel_speed_kmh
from app.modules.security_analytics.router import AnalyticsRequest, _analytics_score


def test_asset_risk_and_criticality_scoring_are_bounded() -> None:
    assert _asset_risk_score("critical", exposure_score=100, vulnerability_count=50, alert_count=50, internet_facing=True) == 100

    criticality = _criticality_from_context(
        AssetCriticalityRequest(
            business_service="payments",
            data_sensitivity="restricted",
            exposure="internet",
            recovery_tier="tier0",
        )
    )

    assert criticality == "critical"


def test_identity_risk_and_impossible_travel_helpers() -> None:
    assert _identity_risk_score(privileged=True, mfa_enabled=False, stale_days=120, failed_login_count=8, risky_group_count=3) >= 80

    speed = _impossible_travel_speed_kmh(
        ImpossibleTravelRequest(
            username="analyst@example.com",
            previous_latitude=40.7128,
            previous_longitude=-74.0060,
            current_latitude=51.5074,
            current_longitude=-0.1278,
            hours_between=2,
        )
    )

    assert speed > 900


def test_security_analytics_scores_matching_signals() -> None:
    body = AnalyticsRequest(
        events=[
            {"message": "powershell.exe -EncodedCommand with AMSI bypass"},
            {"message": "downloadstring invoked by suspicious process"},
        ],
        sensitivity="high",
    )

    result = _analytics_score(body, ["encodedcommand", "amsi", "downloadstring", "bypass"], weight=16)

    assert result["score"] >= 70
    assert "encodedcommand" in result["signals"]
