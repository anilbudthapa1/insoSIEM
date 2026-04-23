import uuid
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import pytest

from app.modules.incidents import service


class FakeResult:
    def __init__(self, value):
        self.value = value

    def scalar_one_or_none(self):
        return self.value


@pytest.mark.asyncio
async def test_link_alert_rejects_incident_outside_tenant(monkeypatch) -> None:
    incident_id = uuid.uuid4()
    alert_id = uuid.uuid4()
    org_id = uuid.uuid4()
    user_id = uuid.uuid4()
    db = SimpleNamespace()

    async def missing_incident(*args, **kwargs):
        return None

    monkeypatch.setattr(service, "get_incident", missing_incident)

    with pytest.raises(LookupError, match="Incident not found"):
        await service.link_alert(incident_id, alert_id, org_id, user_id, db)


@pytest.mark.asyncio
async def test_link_alert_rejects_alert_outside_tenant(monkeypatch) -> None:
    incident_id = uuid.uuid4()
    alert_id = uuid.uuid4()
    org_id = uuid.uuid4()
    user_id = uuid.uuid4()
    db = SimpleNamespace(execute=AsyncMock(return_value=FakeResult(None)))

    async def tenant_incident(*args, **kwargs):
        return SimpleNamespace(id=incident_id, org_id=org_id)

    monkeypatch.setattr(service, "get_incident", tenant_incident)

    with pytest.raises(LookupError, match="Alert not found"):
        await service.link_alert(incident_id, alert_id, org_id, user_id, db)


@pytest.mark.asyncio
async def test_link_alert_rejects_duplicate_link(monkeypatch) -> None:
    incident_id = uuid.uuid4()
    alert_id = uuid.uuid4()
    org_id = uuid.uuid4()
    user_id = uuid.uuid4()
    alert = SimpleNamespace(id=alert_id, title="Suspicious login")
    existing_link = SimpleNamespace(incident_id=incident_id, alert_id=alert_id)
    db = SimpleNamespace(
        execute=AsyncMock(side_effect=[FakeResult(alert), FakeResult(existing_link)]),
    )

    async def tenant_incident(*args, **kwargs):
        return SimpleNamespace(id=incident_id, org_id=org_id)

    monkeypatch.setattr(service, "get_incident", tenant_incident)

    with pytest.raises(ValueError, match="already linked"):
        await service.link_alert(incident_id, alert_id, org_id, user_id, db)


@pytest.mark.asyncio
async def test_link_alert_adds_link_and_timeline(monkeypatch) -> None:
    incident_id = uuid.uuid4()
    alert_id = uuid.uuid4()
    org_id = uuid.uuid4()
    user_id = uuid.uuid4()
    alert = SimpleNamespace(id=alert_id, title="Suspicious login")
    db = SimpleNamespace(
        execute=AsyncMock(side_effect=[FakeResult(alert), FakeResult(None)]),
        add=Mock(),
        flush=AsyncMock(),
        refresh=AsyncMock(),
    )

    async def tenant_incident(*args, **kwargs):
        return SimpleNamespace(id=incident_id, org_id=org_id)

    monkeypatch.setattr(service, "get_incident", tenant_incident)

    link = await service.link_alert(incident_id, alert_id, org_id, user_id, db)

    assert link.incident_id == incident_id
    assert link.alert_id == alert_id
    assert db.add.call_count == 2
