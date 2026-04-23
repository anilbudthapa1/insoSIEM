import hashlib
import hmac

from app.main import create_app
from app.modules.compliance.router import PrivacyRequest, _privacy_posture
from app.modules.developer_ecosystem.router import SdkRequest, _sdk_manifest, _webhook_signature_valid
from app.modules.simulation_validation.router import (
    SimulationRequest,
    _replay_estimate,
    _simulation_risk,
    _validation_coverage,
)
from app.modules.soc_operations.router import MetricsRequest, _alert_volume, _case_backlog, _mean_duration_minutes
from app.modules.storage.router import RestorePreviewRequest, _restore_readiness
from app.modules.system_admin.router import _cluster_health, _ha_readiness, _safe_secret_fingerprint


def test_final_gap_routes_are_registered() -> None:
    app = create_app()
    paths = {getattr(route, "path", "") for route in app.routes}

    expected = {
        "/api/v1/auth/password-reset/request",
        "/api/v1/auth/password-reset/confirm",
        "/api/v1/ingest/grpc/status",
        "/api/v1/ingest/syslog/tls/status",
        "/api/v1/ingest/kafka/status",
        "/api/v1/storage/backup/status",
        "/api/v1/storage/backup/restore/preview",
        "/api/v1/compliance/privacy",
        "/api/v1/compliance/privacy/redaction/preview",
        "/api/v1/soc-operations/capabilities",
        "/api/v1/soc-operations/overview",
        "/api/v1/soc-operations/dashboards/builder/preview",
        "/api/v1/soc-operations/widgets",
        "/api/v1/soc-operations/dashboards/share",
        "/api/v1/soc-operations/analyst-workload",
        "/api/v1/soc-operations/metrics/summary",
        "/api/v1/soc-operations/kpi/dashboard",
        "/api/v1/soc-operations/metrics/mttd",
        "/api/v1/soc-operations/metrics/mttr",
        "/api/v1/soc-operations/sla/breaches",
        "/api/v1/soc-operations/case-backlog",
        "/api/v1/soc-operations/alert-volume",
        "/api/v1/soc-operations/detection-quality",
        "/api/v1/soc-operations/false-positive-rate",
        "/api/v1/soc-operations/shift-handover",
        "/api/v1/soc-operations/hunting-notebooks",
        "/api/v1/soc-operations/threat-hunting/workspace",
        "/api/v1/soc-operations/runbooks",
        "/api/v1/soc-operations/knowledge-base",
        "/api/v1/soc-operations/analyst-activity/audit",
        "/api/v1/validation/capabilities",
        "/api/v1/validation/purple-team/simulate",
        "/api/v1/validation/attacks/simulate",
        "/api/v1/validation/breach-attack/simulate",
        "/api/v1/validation/integrations/mitre-caldera/status",
        "/api/v1/validation/integrations/atomic-red-team/status",
        "/api/v1/validation/detections/validate",
        "/api/v1/validation/controls/validate",
        "/api/v1/validation/sample-log-replay",
        "/api/v1/validation/lab-scenarios",
        "/api/v1/validation/phishing-simulation/status",
        "/api/v1/validation/mail-security-simulation/status",
        "/api/v1/validation/red-team/evidence/import",
        "/api/v1/validation/detection-coverage/test",
        "/api/v1/validation/rules/regression-test",
        "/api/v1/validation/security-content/test",
        "/api/v1/system-admin/capabilities",
        "/api/v1/system-admin/health",
        "/api/v1/system-admin/cluster/health",
        "/api/v1/system-admin/nodes",
        "/api/v1/system-admin/high-availability",
        "/api/v1/system-admin/scaling/horizontal",
        "/api/v1/system-admin/load-balancer",
        "/api/v1/system-admin/disaster-recovery/status",
        "/api/v1/system-admin/configuration",
        "/api/v1/system-admin/environment/setup",
        "/api/v1/system-admin/deployments/docker",
        "/api/v1/system-admin/deployments/kubernetes",
        "/api/v1/system-admin/deployments/helm",
        "/api/v1/system-admin/upgrades/plan",
        "/api/v1/system-admin/migrations/status",
        "/api/v1/system-admin/backup/verification",
        "/api/v1/system-admin/certificates",
        "/api/v1/system-admin/secrets",
        "/api/v1/system-admin/encryption-keys",
        "/api/v1/system-admin/api-tokens",
        "/api/v1/system-admin/integration-secrets-vault",
        "/api/v1/developer/capabilities",
        "/api/v1/developer/api-gateway/status",
        "/api/v1/developer/public-rest-api",
        "/api/v1/developer/graphql/status",
        "/api/v1/developer/webhook-security/validate",
        "/api/v1/developer/plugins",
        "/api/v1/developer/plugin-marketplace",
        "/api/v1/developer/connectors",
        "/api/v1/developer/connector-sdk",
        "/api/v1/developer/forwarder-sdk",
        "/api/v1/developer/detection-sdk",
        "/api/v1/developer/dashboard-sdk",
        "/api/v1/developer/docs",
        "/api/v1/developer/help-center",
        "/api/v1/developer/cli",
        "/api/v1/developer/system-audit-api",
    }

    assert expected.issubset(paths)


def test_soc_operation_helpers_calculate_metrics() -> None:
    alerts = [
        {"severity": "critical", "source": "edr", "first_seen_at": "2026-04-22T10:00:00+00:00", "detected_at": "2026-04-22T10:05:00+00:00"},
        {"severity": "low", "source": "waf"},
    ]
    cases = [{"status": "open", "severity": "critical"}, {"status": "closed", "severity": "low"}]

    assert _alert_volume(alerts)["by_severity"]["critical"] == 1
    assert _case_backlog(cases)["critical_open_cases"] == 1
    assert _mean_duration_minutes(alerts, "first_seen_at", "detected_at") == 5
    assert MetricsRequest(alerts=alerts, cases=cases).sla_minutes == 240


def test_simulation_validation_helpers_are_bounded() -> None:
    simulation = SimulationRequest(
        techniques=["T1059", "T1003", "T1021"],
        controls=["edr", "siem"],
        target_scope="production-readiness",
    )
    coverage = _validation_coverage(
        [{"id": "rule-1"}, {"id": "rule-2"}],
        [{"rule_id": "rule-1"}, {"rule_id": "rule-3"}],
    )

    assert _simulation_risk(simulation) == 48
    assert coverage["coverage_percent"] == 50
    assert _replay_estimate(1000, 250)["estimated_seconds"] == 4


def test_system_admin_and_restore_helpers_hide_sensitive_values() -> None:
    nodes = [{"status": "ready", "zone": "a"}, {"status": "ready", "zone": "b"}, {"status": "ready", "zone": "b"}]
    degraded = [{"status": "ready"}, {"status": "down"}]
    restore = RestorePreviewRequest(backup_id="backup-1", target_environment="production")

    assert _cluster_health(degraded)["status"] == "degraded"
    assert _ha_readiness(nodes)["ha_ready"] is True
    assert _restore_readiness(restore)["approval_required"] is True
    assert _safe_secret_fingerprint("api-key", "tenant") == _safe_secret_fingerprint("api-key", "tenant")


def test_developer_webhook_and_sdk_helpers_are_deterministic() -> None:
    payload = "{\"event\":\"ok\"}"
    secret = "tenant-secret"
    signature = hmac.new(secret.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    manifest = _sdk_manifest(SdkRequest(sdk="connector", language="python", package_name="inso-python"))

    assert _webhook_signature_valid(payload, f"sha256={signature}", secret) is True
    assert _webhook_signature_valid(payload, "bad", secret) is False
    assert manifest["supports_tenant_context"] is True
    assert "tests" in manifest["generated_files"]


def test_privacy_posture_scores_redaction_controls() -> None:
    posture = _privacy_posture(
        PrivacyRequest(
            pii_redaction_enabled=True,
            data_subject_request_days=14,
            consent_required=True,
            sensitive_fields=["email", "ip", "card"],
        )
    )

    assert posture["privacy_score"] >= 90
    assert posture["sensitive_field_count"] == 3
