from datetime import datetime, timezone
from uuid import uuid4

import pytest

from app.modules.ingestion.schemas import DuplicateCheckRequest
from app.modules.ingestion.service import build_dedup_key, build_ingestion_capabilities, check_duplicate
from app.modules.parsers.base_parser import ParsedEvent
from app.modules.parsers.normalizer import EventNormalizer
from app.modules.parsers.simple_parsers import CSVParser, GrokParser, LEEFParser, RegexParser, XMLParser


class FakeRedis:
    def __init__(self) -> None:
        self._keys: set[str] = set()

    async def set(self, key: str, value: str, ex: int, nx: bool) -> bool | None:
        if nx and key in self._keys:
            return None
        self._keys.add(key)
        return True


def test_lightweight_parsers_extract_structured_fields() -> None:
    csv_event = CSVParser(headers=["timestamp", "source.ip", "event.action"]).parse(
        "2026-04-22T01:02:03+00:00,10.0.0.7,login"
    )
    assert csv_event is not None
    assert csv_event.fields["source.ip"] == "10.0.0.7"

    xml_event = XMLParser().parse("<event><user>alice</user><action>login</action></event>")
    assert xml_event is not None
    assert xml_event.fields["event.user"] == "alice"

    leef_event = LEEFParser().parse("LEEF:2.0|Vendor|Product|1.0|auth|src=10.0.0.8\tsev=5")
    assert leef_event is not None
    assert leef_event.fields["leef.ext.src"] == "10.0.0.8"

    regex_event = RegexParser(r"user=(?P<user_name>\w+) src=(?P<source_ip>[0-9.]+)").parse("user=bob src=10.0.0.9")
    assert regex_event is not None
    assert regex_event.fields["source_ip"] == "10.0.0.9"

    grok_event = GrokParser("src=%{IP:source.ip} user=%{WORD:user.name}").parse("src=10.0.0.11 user=carol")
    assert grok_event is not None
    assert grok_event.fields["source_ip"] == "10.0.0.11"


def test_normalizer_maps_common_security_fields() -> None:
    parsed = ParsedEvent(
        timestamp=datetime.now(timezone.utc),
        source_type="json",
        fields={"source.ip": "10.0.0.10", "destination.port": "443", "event.severity": "high"},
        raw="{}",
    )

    normalized = EventNormalizer().normalize(parsed)

    assert normalized.source_ip == "10.0.0.10"
    assert normalized.destination_port == 443
    assert normalized.event_severity == "high"


@pytest.mark.asyncio
async def test_duplicate_check_tracks_stable_tenant_keys() -> None:
    org_id = uuid4()
    body = DuplicateCheckRequest(
        source="rest",
        timestamp=datetime(2026, 4, 22, tzinfo=timezone.utc),
        message="hello",
        fields={"a": 1},
    )
    redis = FakeRedis()

    first = await check_duplicate(org_id, body, redis)
    second = await check_duplicate(org_id, body, redis)

    assert build_dedup_key(org_id, body) == first.dedup_key
    assert first.duplicate is False
    assert second.duplicate is True


def test_ingestion_capabilities_expose_new_inputs() -> None:
    capabilities = build_ingestion_capabilities(uuid4(), nats_client=None)

    assert "webhook_json" in capabilities.supported_inputs
    assert "ndjson_batch" in capabilities.supported_inputs
    assert "duplicate_key_tracking" in capabilities.reliability_controls
