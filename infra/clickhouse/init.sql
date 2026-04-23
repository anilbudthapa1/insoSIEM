CREATE DATABASE IF NOT EXISTS inso_events;

CREATE TABLE IF NOT EXISTS inso_events.inso_events
(
    event_id UUID,
    org_id UUID,
    timestamp DateTime64(3, 'UTC'),
    source LowCardinality(String),
    message String,
    source_type LowCardinality(String) DEFAULT '',
    fields String DEFAULT '{}',
    normalized_fields String DEFAULT '{}',
    ingested_at DateTime64(3, 'UTC') DEFAULT now64()
)
ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (org_id, timestamp, event_id)
TTL timestamp + INTERVAL 90 DAY;
