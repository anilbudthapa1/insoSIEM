from app.modules.alerts.models import Alert
from app.modules.audit.models import AuditLog
from app.modules.auth.models import RefreshToken
from app.modules.incidents.models import Incident, IncidentAlert, IncidentTimeline


def test_soc_models_align_to_bootstrap_column_names() -> None:
    assert Incident.__table__.c.organization_id is not None
    assert Incident.__table__.c.closed_at is not None
    assert IncidentAlert.__table__.c.added_at is not None
    assert IncidentAlert.__table__.c.added_by is not None
    assert IncidentTimeline.__table__.c.user_id is not None
    assert IncidentTimeline.__table__.c.message is not None
    assert IncidentTimeline.__table__.c.occurred_at is not None
    assert Alert.__table__.c.organization_id is not None
    assert Alert.__table__.c.raw_event is not None
    assert AuditLog.__table__.c.organization_id is not None
    assert AuditLog.__table__.c.outcome is not None
    assert AuditLog.__table__.c.metadata is not None
    assert RefreshToken.__table__.c.ip_address.type.__class__.__name__ == "INET"
