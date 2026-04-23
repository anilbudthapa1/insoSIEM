-- ============================================================
-- Inso SIEM — PostgreSQL Schema
-- PostgreSQL 16+
-- All tables, indexes, FK constraints, and seed data
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Extensions
-- ────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ────────────────────────────────────────────────────────────
-- Utility: updated_at trigger function
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────
-- ORGANIZATIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE organizations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    logo_url        TEXT,
    plan            VARCHAR(50) NOT NULL DEFAULT 'enterprise',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    max_users       INTEGER NOT NULL DEFAULT 100,
    max_assets      INTEGER NOT NULL DEFAULT 10000,
    retention_days  INTEGER NOT NULL DEFAULT 365,
    settings        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations (slug);
CREATE INDEX idx_organizations_is_active ON organizations (is_active);

CREATE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- USERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id         UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    email                   VARCHAR(320) NOT NULL UNIQUE,
    username                VARCHAR(100) NOT NULL UNIQUE,
    full_name               VARCHAR(255) NOT NULL,
    hashed_password         TEXT NOT NULL,
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
    is_superuser            BOOLEAN NOT NULL DEFAULT FALSE,
    avatar_url              TEXT,
    phone                   VARCHAR(50),
    timezone                VARCHAR(100) NOT NULL DEFAULT 'UTC',
    locale                  VARCHAR(20) NOT NULL DEFAULT 'en',
    last_login_at           TIMESTAMPTZ,
    last_login_ip           INET,
    failed_login_attempts   INTEGER NOT NULL DEFAULT 0,
    locked_until            TIMESTAMPTZ,
    mfa_enabled             BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret              TEXT,
    mfa_backup_codes        TEXT[],
    password_changed_at     TIMESTAMPTZ,
    preferences             JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_organization_id ON users (organization_id);
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);
CREATE INDEX idx_users_is_active ON users (is_active);
CREATE INDEX idx_users_last_login_at ON users (last_login_at DESC);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- REFRESH TOKENS
-- ────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL UNIQUE,
    device_info     TEXT,
    ip_address      INET,
    user_agent      TEXT,
    is_revoked      BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at      TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens (token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);
CREATE INDEX idx_refresh_tokens_is_revoked ON refresh_tokens (is_revoked) WHERE is_revoked = FALSE;

-- ────────────────────────────────────────────────────────────
-- ROLES
-- ────────────────────────────────────────────────────────────
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations (id) ON DELETE CASCADE,  -- NULL = system-wide role
    name            VARCHAR(100) NOT NULL,
    display_name    VARCHAR(255) NOT NULL,
    description     TEXT,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, name)
);

CREATE INDEX idx_roles_organization_id ON roles (organization_id);
CREATE INDEX idx_roles_name ON roles (name);
CREATE INDEX idx_roles_is_system ON roles (is_system);

CREATE TRIGGER trg_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- PERMISSIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE permissions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource        VARCHAR(100) NOT NULL,     -- e.g. "alerts", "incidents", "users"
    action          VARCHAR(50) NOT NULL,      -- e.g. "read", "write", "delete", "execute"
    description     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (resource, action)
);

CREATE INDEX idx_permissions_resource ON permissions (resource);

-- ────────────────────────────────────────────────────────────
-- ROLE_PERMISSIONS
-- ────────────────────────────────────────────────────────────
CREATE TABLE role_permissions (
    role_id         UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    permission_id   UUID NOT NULL REFERENCES permissions (id) ON DELETE CASCADE,
    granted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by      UUID REFERENCES users (id) ON DELETE SET NULL,
    PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions (permission_id);

-- ────────────────────────────────────────────────────────────
-- USER_ROLES
-- ────────────────────────────────────────────────────────────
CREATE TABLE user_roles (
    user_id         UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id         UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by     UUID REFERENCES users (id) ON DELETE SET NULL,
    expires_at      TIMESTAMPTZ,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

-- ────────────────────────────────────────────────────────────
-- ASSETS
-- ────────────────────────────────────────────────────────────
CREATE TABLE assets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    hostname        VARCHAR(255) NOT NULL,
    fqdn            VARCHAR(512),
    ip_addresses    INET[],
    mac_addresses   MACADDR[],
    os_name         VARCHAR(100),
    os_version      VARCHAR(100),
    os_family       VARCHAR(50),    -- windows | linux | macos | other
    asset_type      VARCHAR(50),    -- server | workstation | network | cloud | container
    criticality     SMALLINT NOT NULL DEFAULT 3  CHECK (criticality BETWEEN 1 AND 5),
    owner           VARCHAR(255),
    department      VARCHAR(255),
    location        VARCHAR(255),
    tags            TEXT[] NOT NULL DEFAULT '{}',
    labels          JSONB NOT NULL DEFAULT '{}',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    first_seen_at   TIMESTAMPTZ,
    last_seen_at    TIMESTAMPTZ,
    agent_id        UUID,  -- FK set after agents table
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_organization_id ON assets (organization_id);
CREATE INDEX idx_assets_hostname ON assets USING gin (hostname gin_trgm_ops);
CREATE INDEX idx_assets_ip_addresses ON assets USING gin (ip_addresses);
CREATE INDEX idx_assets_tags ON assets USING gin (tags);
CREATE INDEX idx_assets_criticality ON assets (criticality);
CREATE INDEX idx_assets_asset_type ON assets (asset_type);
CREATE INDEX idx_assets_is_active ON assets (is_active);
CREATE INDEX idx_assets_last_seen_at ON assets (last_seen_at DESC);

CREATE TRIGGER trg_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- AGENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE agents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    asset_id        UUID REFERENCES assets (id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL DEFAULT '',
    hostname        VARCHAR(255) NOT NULL DEFAULT '',
    version         VARCHAR(50),
    os_type         VARCHAR(64),
    platform        VARCHAR(50),    -- linux | windows | macos
    arch            VARCHAR(20),    -- amd64 | arm64
    status          VARCHAR(50) NOT NULL DEFAULT 'offline', -- online | offline | degraded | updating
    api_key_hash    TEXT NOT NULL UNIQUE,
    last_heartbeat  TIMESTAMPTZ,
    last_ip         INET,
    config          JSONB NOT NULL DEFAULT '{}',
    tags            TEXT[] NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_organization_id ON agents (organization_id);
CREATE INDEX idx_agents_asset_id ON agents (asset_id);
CREATE INDEX idx_agents_status ON agents (status);
CREATE INDEX idx_agents_last_heartbeat ON agents (last_heartbeat DESC);

CREATE TRIGGER trg_agents_updated_at
    BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add FK from assets to agents
ALTER TABLE assets ADD CONSTRAINT fk_assets_agent_id
    FOREIGN KEY (agent_id) REFERENCES agents (id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────
-- DETECTION RULES
-- ────────────────────────────────────────────────────────────
CREATE TABLE detection_rules (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    created_by          UUID REFERENCES users (id) ON DELETE SET NULL,
    updated_by          UUID REFERENCES users (id) ON DELETE SET NULL,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    rule_type           VARCHAR(50) NOT NULL DEFAULT 'sigma', -- sigma | yara | custom | ml
    rule_language       VARCHAR(50),
    rule_content        TEXT NOT NULL,
    parsed_rule         JSONB,
    severity            VARCHAR(20) NOT NULL DEFAULT 'medium', -- low | medium | high | critical
    confidence          SMALLINT NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
    is_enabled          BOOLEAN NOT NULL DEFAULT TRUE,
    is_system           BOOLEAN NOT NULL DEFAULT FALSE,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    mitre_tactics       TEXT[] NOT NULL DEFAULT '{}',
    mitre_techniques    TEXT[] NOT NULL DEFAULT '{}',
    data_sources        TEXT[] NOT NULL DEFAULT '{}',  -- which log sources this rule applies to
    false_positive_rate REAL,
    alert_threshold     INTEGER NOT NULL DEFAULT 1,
    dedup_window_secs   INTEGER NOT NULL DEFAULT 300,
    suppression_secs    INTEGER NOT NULL DEFAULT 3600,
    actions             JSONB NOT NULL DEFAULT '[]',  -- array of action configs
    metadata            JSONB NOT NULL DEFAULT '{}',
    last_triggered_at   TIMESTAMPTZ,
    trigger_count       BIGINT NOT NULL DEFAULT 0,
    version             INTEGER NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_detection_rules_organization_id ON detection_rules (organization_id);
CREATE INDEX idx_detection_rules_severity ON detection_rules (severity);
CREATE INDEX idx_detection_rules_is_enabled ON detection_rules (is_enabled);
CREATE INDEX idx_detection_rules_rule_type ON detection_rules (rule_type);
CREATE INDEX idx_detection_rules_tags ON detection_rules USING gin (tags);
CREATE INDEX idx_detection_rules_mitre_techniques ON detection_rules USING gin (mitre_techniques);
CREATE INDEX idx_detection_rules_name_trgm ON detection_rules USING gin (name gin_trgm_ops);

CREATE TRIGGER trg_detection_rules_updated_at
    BEFORE UPDATE ON detection_rules
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- ALERTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE alerts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    rule_id             UUID REFERENCES detection_rules (id) ON DELETE SET NULL,
    asset_id            UUID REFERENCES assets (id) ON DELETE SET NULL,
    assigned_to         UUID REFERENCES users (id) ON DELETE SET NULL,
    title               VARCHAR(512) NOT NULL,
    description         TEXT,
    severity            VARCHAR(20) NOT NULL DEFAULT 'medium',
    status              VARCHAR(50) NOT NULL DEFAULT 'new', -- new | in_progress | investigating | resolved | false_positive | suppressed
    dedup_hash          VARCHAR(128) NOT NULL,
    source_type         VARCHAR(100),    -- e.g. "syslog", "winlog", "cloudtrail"
    source_name         VARCHAR(255),
    event_ids           TEXT[] NOT NULL DEFAULT '{}',  -- ClickHouse event UUIDs
    src_ip              INET,
    dst_ip              INET,
    hostname            VARCHAR(255),
    username            VARCHAR(255),
    process_name        VARCHAR(255),
    command_line        TEXT,
    file_path           TEXT,
    rule_name           VARCHAR(255),
    mitre_tactics       TEXT[] NOT NULL DEFAULT '{}',
    mitre_techniques    TEXT[] NOT NULL DEFAULT '{}',
    ioc_matches         JSONB NOT NULL DEFAULT '[]',
    raw_event           JSONB,
    enrichment          JSONB NOT NULL DEFAULT '{}',
    ai_summary          TEXT,
    ai_recommended_action TEXT,
    risk_score          REAL NOT NULL DEFAULT 0.0 CHECK (risk_score BETWEEN 0.0 AND 100.0),
    first_seen_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at         TIMESTAMPTZ,
    resolved_by         UUID REFERENCES users (id) ON DELETE SET NULL,
    resolution_note     TEXT,
    suppressed_until    TIMESTAMPTZ,
    occurrence_count    INTEGER NOT NULL DEFAULT 1,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    labels              JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_alerts_dedup_hash ON alerts (organization_id, dedup_hash)
    WHERE status NOT IN ('resolved', 'false_positive');
CREATE INDEX idx_alerts_organization_id ON alerts (organization_id);
CREATE INDEX idx_alerts_rule_id ON alerts (rule_id);
CREATE INDEX idx_alerts_asset_id ON alerts (asset_id);
CREATE INDEX idx_alerts_assigned_to ON alerts (assigned_to);
CREATE INDEX idx_alerts_severity ON alerts (severity);
CREATE INDEX idx_alerts_status ON alerts (status);
CREATE INDEX idx_alerts_first_seen_at ON alerts (first_seen_at DESC);
CREATE INDEX idx_alerts_last_seen_at ON alerts (last_seen_at DESC);
CREATE INDEX idx_alerts_src_ip ON alerts (src_ip);
CREATE INDEX idx_alerts_dst_ip ON alerts (dst_ip);
CREATE INDEX idx_alerts_hostname_trgm ON alerts USING gin (hostname gin_trgm_ops);
CREATE INDEX idx_alerts_username_trgm ON alerts USING gin (username gin_trgm_ops);
CREATE INDEX idx_alerts_risk_score ON alerts (risk_score DESC);
CREATE INDEX idx_alerts_mitre_techniques ON alerts USING gin (mitre_techniques);
CREATE INDEX idx_alerts_tags ON alerts USING gin (tags);

CREATE TRIGGER trg_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- INCIDENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE incidents (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    created_by          UUID REFERENCES users (id) ON DELETE SET NULL,
    assigned_to         UUID REFERENCES users (id) ON DELETE SET NULL,
    lead_analyst        UUID REFERENCES users (id) ON DELETE SET NULL,
    title               VARCHAR(512) NOT NULL,
    description         TEXT,
    severity            VARCHAR(20) NOT NULL DEFAULT 'medium',
    status              VARCHAR(50) NOT NULL DEFAULT 'open',  -- open | in_progress | contained | remediated | closed | false_positive
    priority            SMALLINT NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    incident_type       VARCHAR(100),  -- malware | phishing | data_breach | insider | dos | etc.
    affected_assets     UUID[] NOT NULL DEFAULT '{}',
    mitre_tactics       TEXT[] NOT NULL DEFAULT '{}',
    mitre_techniques    TEXT[] NOT NULL DEFAULT '{}',
    ioc_list            TEXT[] NOT NULL DEFAULT '{}',
    summary             TEXT,
    ai_summary          TEXT,
    root_cause          TEXT,
    remediation_steps   TEXT,
    lessons_learned     TEXT,
    detection_time      TIMESTAMPTZ,
    containment_time    TIMESTAMPTZ,
    eradication_time    TIMESTAMPTZ,
    recovery_time       TIMESTAMPTZ,
    closed_at           TIMESTAMPTZ,
    sla_due_at          TIMESTAMPTZ,
    sla_breached        BOOLEAN NOT NULL DEFAULT FALSE,
    tags                TEXT[] NOT NULL DEFAULT '{}',
    labels              JSONB NOT NULL DEFAULT '{}',
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_organization_id ON incidents (organization_id);
CREATE INDEX idx_incidents_created_by ON incidents (created_by);
CREATE INDEX idx_incidents_assigned_to ON incidents (assigned_to);
CREATE INDEX idx_incidents_severity ON incidents (severity);
CREATE INDEX idx_incidents_status ON incidents (status);
CREATE INDEX idx_incidents_priority ON incidents (priority DESC);
CREATE INDEX idx_incidents_created_at ON incidents (created_at DESC);
CREATE INDEX idx_incidents_sla_due_at ON incidents (sla_due_at);
CREATE INDEX idx_incidents_tags ON incidents USING gin (tags);
CREATE INDEX idx_incidents_mitre_techniques ON incidents USING gin (mitre_techniques);

CREATE TRIGGER trg_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- INCIDENT_ALERTS (M:N junction)
-- ────────────────────────────────────────────────────────────
CREATE TABLE incident_alerts (
    incident_id     UUID NOT NULL REFERENCES incidents (id) ON DELETE CASCADE,
    alert_id        UUID NOT NULL REFERENCES alerts (id) ON DELETE CASCADE,
    added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    added_by        UUID REFERENCES users (id) ON DELETE SET NULL,
    note            TEXT,
    PRIMARY KEY (incident_id, alert_id)
);

CREATE INDEX idx_incident_alerts_incident_id ON incident_alerts (incident_id);
CREATE INDEX idx_incident_alerts_alert_id ON incident_alerts (alert_id);

-- ────────────────────────────────────────────────────────────
-- INCIDENT_TIMELINE
-- ────────────────────────────────────────────────────────────
CREATE TABLE incident_timeline (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id     UUID NOT NULL REFERENCES incidents (id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    event_type      VARCHAR(100) NOT NULL,  -- status_change | comment | alert_linked | evidence_added | playbook_run | etc.
    event_data      JSONB NOT NULL DEFAULT '{}',
    message         TEXT,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incident_timeline_incident_id ON incident_timeline (incident_id);
CREATE INDEX idx_incident_timeline_occurred_at ON incident_timeline (occurred_at DESC);
CREATE INDEX idx_incident_timeline_event_type ON incident_timeline (event_type);

-- ────────────────────────────────────────────────────────────
-- CASES (forensic / investigation tracking)
-- ────────────────────────────────────────────────────────────
CREATE TABLE cases (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id     UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    incident_id         UUID REFERENCES incidents (id) ON DELETE SET NULL,
    created_by          UUID REFERENCES users (id) ON DELETE SET NULL,
    assigned_to         UUID REFERENCES users (id) ON DELETE SET NULL,
    title               VARCHAR(512) NOT NULL,
    description         TEXT,
    status              VARCHAR(50) NOT NULL DEFAULT 'open',  -- open | in_progress | pending | closed
    severity            VARCHAR(20) NOT NULL DEFAULT 'medium',
    case_number         VARCHAR(50) NOT NULL,
    category            VARCHAR(100),
    tags                TEXT[] NOT NULL DEFAULT '{}',
    tlp_level           VARCHAR(10) NOT NULL DEFAULT 'amber',  -- white | green | amber | red
    pap_level           VARCHAR(10) NOT NULL DEFAULT 'amber',
    is_confidential     BOOLEAN NOT NULL DEFAULT FALSE,
    resolution          TEXT,
    closed_at           TIMESTAMPTZ,
    due_at              TIMESTAMPTZ,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_cases_case_number ON cases (organization_id, case_number);
CREATE INDEX idx_cases_organization_id ON cases (organization_id);
CREATE INDEX idx_cases_incident_id ON cases (incident_id);
CREATE INDEX idx_cases_assigned_to ON cases (assigned_to);
CREATE INDEX idx_cases_status ON cases (status);
CREATE INDEX idx_cases_severity ON cases (severity);
CREATE INDEX idx_cases_created_at ON cases (created_at DESC);
CREATE INDEX idx_cases_tags ON cases USING gin (tags);

CREATE TRIGGER trg_cases_updated_at
    BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-increment case number sequence per org (handled at app layer)
CREATE SEQUENCE case_number_seq START 1000;

-- ────────────────────────────────────────────────────────────
-- CASE_COMMENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE case_comments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id         UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    parent_id       UUID REFERENCES case_comments (id) ON DELETE SET NULL,
    content         TEXT NOT NULL,
    is_internal     BOOLEAN NOT NULL DEFAULT TRUE,
    is_edited       BOOLEAN NOT NULL DEFAULT FALSE,
    edited_at       TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_case_comments_case_id ON case_comments (case_id);
CREATE INDEX idx_case_comments_user_id ON case_comments (user_id);
CREATE INDEX idx_case_comments_created_at ON case_comments (created_at DESC);

CREATE TRIGGER trg_case_comments_updated_at
    BEFORE UPDATE ON case_comments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- CASE_ATTACHMENTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE case_attachments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id         UUID NOT NULL REFERENCES cases (id) ON DELETE CASCADE,
    uploaded_by     UUID REFERENCES users (id) ON DELETE SET NULL,
    filename        VARCHAR(512) NOT NULL,
    original_name   VARCHAR(512) NOT NULL,
    content_type    VARCHAR(255),
    size_bytes      BIGINT NOT NULL DEFAULT 0,
    minio_bucket    VARCHAR(255) NOT NULL,
    minio_key       TEXT NOT NULL,
    sha256_hash     VARCHAR(64),
    md5_hash        VARCHAR(32),
    description     TEXT,
    is_malicious    BOOLEAN,
    scan_result     JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_case_attachments_case_id ON case_attachments (case_id);
CREATE INDEX idx_case_attachments_sha256 ON case_attachments (sha256_hash);

-- ────────────────────────────────────────────────────────────
-- IOC (Indicators of Compromise)
-- ────────────────────────────────────────────────────────────
CREATE TABLE ioc (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    feed_id         UUID,  -- FK set after threat_feeds table
    created_by      UUID REFERENCES users (id) ON DELETE SET NULL,
    ioc_type        VARCHAR(50) NOT NULL, -- ip | domain | url | hash_md5 | hash_sha1 | hash_sha256 | email | filename | registry | cve
    value           TEXT NOT NULL,
    value_normalized TEXT NOT NULL,
    description     TEXT,
    confidence      SMALLINT NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
    severity        VARCHAR(20) NOT NULL DEFAULT 'medium',
    tlp_level       VARCHAR(10) NOT NULL DEFAULT 'amber',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    source          VARCHAR(255),
    tags            TEXT[] NOT NULL DEFAULT '{}',
    mitre_techniques TEXT[] NOT NULL DEFAULT '{}',
    malware_family  VARCHAR(255),
    threat_actor    VARCHAR(255),
    campaign        VARCHAR(255),
    country         CHAR(2),
    asn             INTEGER,
    hits_count      BIGINT NOT NULL DEFAULT 0,
    first_seen      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    raw_data        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, ioc_type, value_normalized)
);

CREATE INDEX idx_ioc_organization_id ON ioc (organization_id);
CREATE INDEX idx_ioc_ioc_type ON ioc (ioc_type);
CREATE INDEX idx_ioc_value_normalized ON ioc (value_normalized);
CREATE INDEX idx_ioc_value_trgm ON ioc USING gin (value gin_trgm_ops);
CREATE INDEX idx_ioc_is_active ON ioc (is_active);
CREATE INDEX idx_ioc_severity ON ioc (severity);
CREATE INDEX idx_ioc_expires_at ON ioc (expires_at);
CREATE INDEX idx_ioc_tags ON ioc USING gin (tags);
CREATE INDEX idx_ioc_last_seen ON ioc (last_seen DESC);
CREATE INDEX idx_ioc_hits_count ON ioc (hits_count DESC);

CREATE TRIGGER trg_ioc_updated_at
    BEFORE UPDATE ON ioc
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- THREAT_FEEDS
-- ────────────────────────────────────────────────────────────
CREATE TABLE threat_feeds (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    feed_type       VARCHAR(50) NOT NULL, -- taxii | stix | csv | json | txt | misp | otx | custom
    url             TEXT,
    api_key         TEXT,  -- stored encrypted at app layer
    auth_type       VARCHAR(50) NOT NULL DEFAULT 'none',  -- none | api_key | bearer | basic
    auth_config     JSONB NOT NULL DEFAULT '{}',
    is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    poll_interval_secs INTEGER NOT NULL DEFAULT 3600,
    last_polled_at  TIMESTAMPTZ,
    last_poll_status VARCHAR(50),  -- success | error | partial
    last_error      TEXT,
    ioc_count       BIGINT NOT NULL DEFAULT 0,
    confidence      SMALLINT NOT NULL DEFAULT 70 CHECK (confidence BETWEEN 0 AND 100),
    tlp_level       VARCHAR(10) NOT NULL DEFAULT 'amber',
    tags            TEXT[] NOT NULL DEFAULT '{}',
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_threat_feeds_organization_id ON threat_feeds (organization_id);
CREATE INDEX idx_threat_feeds_is_enabled ON threat_feeds (is_enabled);
CREATE INDEX idx_threat_feeds_last_polled_at ON threat_feeds (last_polled_at);

CREATE TRIGGER trg_threat_feeds_updated_at
    BEFORE UPDATE ON threat_feeds
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add FK from ioc to threat_feeds
ALTER TABLE ioc ADD CONSTRAINT fk_ioc_feed_id
    FOREIGN KEY (feed_id) REFERENCES threat_feeds (id) ON DELETE SET NULL;

-- ────────────────────────────────────────────────────────────
-- PLAYBOOKS
-- ────────────────────────────────────────────────────────────
CREATE TABLE playbooks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    created_by      UUID REFERENCES users (id) ON DELETE SET NULL,
    updated_by      UUID REFERENCES users (id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    trigger_type    VARCHAR(50) NOT NULL DEFAULT 'manual',  -- manual | alert | incident | schedule | webhook
    trigger_config  JSONB NOT NULL DEFAULT '{}',
    steps           JSONB NOT NULL DEFAULT '[]',  -- ordered array of action steps
    conditions      JSONB NOT NULL DEFAULT '{}',  -- filter conditions for auto-trigger
    is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
    is_system       BOOLEAN NOT NULL DEFAULT FALSE,
    version         INTEGER NOT NULL DEFAULT 1,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    run_count       BIGINT NOT NULL DEFAULT 0,
    last_run_at     TIMESTAMPTZ,
    last_run_status VARCHAR(50),
    timeout_secs    INTEGER NOT NULL DEFAULT 3600,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playbooks_organization_id ON playbooks (organization_id);
CREATE INDEX idx_playbooks_trigger_type ON playbooks (trigger_type);
CREATE INDEX idx_playbooks_is_enabled ON playbooks (is_enabled);
CREATE INDEX idx_playbooks_tags ON playbooks USING gin (tags);

CREATE TRIGGER trg_playbooks_updated_at
    BEFORE UPDATE ON playbooks
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- PLAYBOOK_RUNS
-- ────────────────────────────────────────────────────────────
CREATE TABLE playbook_runs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playbook_id     UUID NOT NULL REFERENCES playbooks (id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    triggered_by    UUID REFERENCES users (id) ON DELETE SET NULL,
    trigger_type    VARCHAR(50) NOT NULL,
    trigger_ref_id  UUID,   -- alert_id or incident_id that triggered this run
    trigger_ref_type VARCHAR(50),
    status          VARCHAR(50) NOT NULL DEFAULT 'pending',  -- pending | running | completed | failed | cancelled | timed_out
    input_data      JSONB NOT NULL DEFAULT '{}',
    output_data     JSONB NOT NULL DEFAULT '{}',
    step_results    JSONB NOT NULL DEFAULT '[]',
    error_message   TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    duration_ms     INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_playbook_runs_playbook_id ON playbook_runs (playbook_id);
CREATE INDEX idx_playbook_runs_organization_id ON playbook_runs (organization_id);
CREATE INDEX idx_playbook_runs_status ON playbook_runs (status);
CREATE INDEX idx_playbook_runs_created_at ON playbook_runs (created_at DESC);
CREATE INDEX idx_playbook_runs_trigger_ref ON playbook_runs (trigger_ref_id, trigger_ref_type);

-- ────────────────────────────────────────────────────────────
-- SAVED_QUERIES
-- ────────────────────────────────────────────────────────────
CREATE TABLE saved_queries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    created_by      UUID REFERENCES users (id) ON DELETE SET NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    query_type      VARCHAR(50) NOT NULL DEFAULT 'clickhouse',  -- clickhouse | postgres | sigma
    query_text      TEXT NOT NULL,
    parameters      JSONB NOT NULL DEFAULT '{}',
    is_public       BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned       BOOLEAN NOT NULL DEFAULT FALSE,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    last_run_at     TIMESTAMPTZ,
    run_count       INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_queries_organization_id ON saved_queries (organization_id);
CREATE INDEX idx_saved_queries_created_by ON saved_queries (created_by);
CREATE INDEX idx_saved_queries_is_public ON saved_queries (is_public);
CREATE INDEX idx_saved_queries_tags ON saved_queries USING gin (tags);

CREATE TRIGGER trg_saved_queries_updated_at
    BEFORE UPDATE ON saved_queries
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- MITRE_TECHNIQUES
-- ────────────────────────────────────────────────────────────
CREATE TABLE mitre_techniques (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technique_id    VARCHAR(20) NOT NULL UNIQUE,  -- e.g. T1059.001
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    tactic_id       VARCHAR(20),
    tactic_name     VARCHAR(255),
    is_subtechnique BOOLEAN NOT NULL DEFAULT FALSE,
    parent_id       VARCHAR(20),
    url             TEXT,
    platforms       TEXT[] NOT NULL DEFAULT '{}',
    data_sources    TEXT[] NOT NULL DEFAULT '{}',
    detection       TEXT,
    mitigation      TEXT,
    version         VARCHAR(20),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mitre_techniques_technique_id ON mitre_techniques (technique_id);
CREATE INDEX idx_mitre_techniques_tactic_id ON mitre_techniques (tactic_id);
CREATE INDEX idx_mitre_techniques_is_subtechnique ON mitre_techniques (is_subtechnique);
CREATE INDEX idx_mitre_techniques_platforms ON mitre_techniques USING gin (platforms);
CREATE INDEX idx_mitre_techniques_name_trgm ON mitre_techniques USING gin (name gin_trgm_ops);

CREATE TRIGGER trg_mitre_techniques_updated_at
    BEFORE UPDATE ON mitre_techniques
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ────────────────────────────────────────────────────────────
-- AUDIT_LOGS
-- ────────────────────────────────────────────────────────────
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
    session_id      TEXT,
    action          VARCHAR(100) NOT NULL,  -- e.g. "user.login", "alert.status_change"
    resource_type   VARCHAR(100),
    resource_id     TEXT,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      INET,
    user_agent      TEXT,
    request_id      TEXT,
    outcome         VARCHAR(20) NOT NULL DEFAULT 'success',  -- success | failure | error
    error_message   TEXT,
    duration_ms     INTEGER,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_organization_id ON audit_logs (organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_resource ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs (ip_address);
CREATE INDEX idx_audit_logs_outcome ON audit_logs (outcome);

-- Partition audit_logs by month for large deployments (comment out if not needed)
-- Partition can be added here if deploying on PostgreSQL 16+ with pg_partman

-- ============================================================
-- SEED DATA
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- Default Organization
-- ────────────────────────────────────────────────────────────
INSERT INTO organizations (id, name, slug, description, plan, is_active, max_users, max_assets, retention_days)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Default Organization',
    'default',
    'Default organization created on system initialization',
    'enterprise',
    TRUE,
    100,
    10000,
    365
);

-- ────────────────────────────────────────────────────────────
-- System Roles (no org = global)
-- ────────────────────────────────────────────────────────────
INSERT INTO roles (id, organization_id, name, display_name, description, is_system) VALUES
    ('b0000000-0000-0000-0000-000000000001', NULL, 'super_admin',  'Super Administrator',
     'Full system access across all organizations. Cannot be deleted.', TRUE),
    ('b0000000-0000-0000-0000-000000000002', NULL, 'admin',        'Administrator',
     'Full access within an organization including user management.', TRUE),
    ('b0000000-0000-0000-0000-000000000003', NULL, 'manager',      'Manager',
     'Can manage incidents, cases, and analysts. Cannot modify system settings.', TRUE),
    ('b0000000-0000-0000-0000-000000000004', NULL, 'analyst',      'SOC Analyst',
     'Can view and update alerts, incidents, and cases. Cannot manage users.', TRUE),
    ('b0000000-0000-0000-0000-000000000005', NULL, 'readonly',     'Read Only',
     'Read-only access to dashboards, alerts, and incidents.', TRUE);

-- ────────────────────────────────────────────────────────────
-- Permissions (resource × action matrix)
-- ────────────────────────────────────────────────────────────
INSERT INTO permissions (resource, action, description) VALUES
    -- Organizations
    ('organizations', 'read',    'View organization settings'),
    ('organizations', 'write',   'Edit organization settings'),
    ('organizations', 'delete',  'Delete an organization'),
    -- Users
    ('users', 'read',            'View user list and profiles'),
    ('users', 'write',           'Create or update users'),
    ('users', 'delete',          'Delete users'),
    ('users', 'impersonate',     'Impersonate another user'),
    -- Roles & Permissions
    ('roles', 'read',            'View roles and permissions'),
    ('roles', 'write',           'Create or update roles'),
    ('roles', 'delete',          'Delete roles'),
    -- Assets
    ('assets', 'read',           'View assets'),
    ('assets', 'write',          'Create or update assets'),
    ('assets', 'delete',         'Delete assets'),
    -- Agents
    ('agents', 'read',           'View agents'),
    ('agents', 'write',          'Manage agents'),
    ('agents', 'delete',         'Delete agents'),
    -- Detection Rules
    ('rules', 'read',            'View detection rules'),
    ('rules', 'write',           'Create or update detection rules'),
    ('rules', 'delete',          'Delete detection rules'),
    ('rules', 'enable',          'Enable or disable detection rules'),
    -- Alerts
    ('alerts', 'read',           'View alerts'),
    ('alerts', 'write',          'Update alert status and fields'),
    ('alerts', 'delete',         'Delete alerts'),
    ('alerts', 'assign',         'Assign alerts to analysts'),
    -- Incidents
    ('incidents', 'read',        'View incidents'),
    ('incidents', 'write',       'Create or update incidents'),
    ('incidents', 'delete',      'Delete incidents'),
    ('incidents', 'assign',      'Assign incidents'),
    ('incidents', 'close',       'Close or resolve incidents'),
    -- Cases
    ('cases', 'read',            'View cases'),
    ('cases', 'write',           'Create or update cases'),
    ('cases', 'delete',          'Delete cases'),
    ('cases', 'close',           'Close cases'),
    -- IOC
    ('ioc', 'read',              'View indicators of compromise'),
    ('ioc', 'write',             'Add or update IOCs'),
    ('ioc', 'delete',            'Delete IOCs'),
    -- Threat Feeds
    ('feeds', 'read',            'View threat feed configurations'),
    ('feeds', 'write',           'Configure threat feeds'),
    ('feeds', 'delete',          'Delete threat feeds'),
    -- Playbooks
    ('playbooks', 'read',        'View playbooks'),
    ('playbooks', 'write',       'Create or update playbooks'),
    ('playbooks', 'delete',      'Delete playbooks'),
    ('playbooks', 'execute',     'Execute playbooks'),
    -- Saved Queries
    ('queries', 'read',          'View saved queries'),
    ('queries', 'write',         'Create or update saved queries'),
    ('queries', 'delete',        'Delete saved queries'),
    ('queries', 'execute',       'Execute raw queries'),
    -- MITRE
    ('mitre', 'read',            'View MITRE ATT&CK data'),
    -- Audit Logs
    ('audit_logs', 'read',       'View audit logs'),
    -- Reports
    ('reports', 'read',          'View reports'),
    ('reports', 'write',         'Generate and export reports'),
    -- Settings
    ('settings', 'read',         'View system settings'),
    ('settings', 'write',        'Modify system settings');

-- ────────────────────────────────────────────────────────────
-- Role ↔ Permission bindings
-- ────────────────────────────────────────────────────────────

-- super_admin: ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000001', id FROM permissions;

-- admin: everything except impersonate and org delete
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000002', id FROM permissions
WHERE NOT (resource = 'users' AND action = 'impersonate')
  AND NOT (resource = 'organizations' AND action = 'delete');

-- manager: no user/role/settings management, no raw query execution, no rule deletion
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000003', id FROM permissions
WHERE resource IN ('alerts','incidents','cases','ioc','playbooks','assets','agents','rules','queries','mitre','feeds','reports','audit_logs')
  AND action NOT IN ('delete')
  AND NOT (resource = 'queries' AND action = 'execute')
  AND NOT (resource = 'rules' AND action = 'delete');

-- analyst: read + limited write
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000004', id FROM permissions
WHERE (resource = 'alerts'    AND action IN ('read','write','assign'))
   OR (resource = 'incidents' AND action IN ('read','write','assign'))
   OR (resource = 'cases'     AND action IN ('read','write'))
   OR (resource = 'ioc'       AND action IN ('read','write'))
   OR (resource = 'assets'    AND action IN ('read'))
   OR (resource = 'agents'    AND action IN ('read'))
   OR (resource = 'rules'     AND action IN ('read'))
   OR (resource = 'feeds'     AND action IN ('read'))
   OR (resource = 'playbooks' AND action IN ('read','execute'))
   OR (resource = 'queries'   AND action IN ('read','write'))
   OR (resource = 'mitre'     AND action IN ('read'))
   OR (resource = 'reports'   AND action IN ('read'));

-- readonly: read everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'b0000000-0000-0000-0000-000000000005', id FROM permissions
WHERE action = 'read';

-- ────────────────────────────────────────────────────────────
-- Default Admin User
-- password = Admin123!  (bcrypt $2b$12$ hash)
-- ────────────────────────────────────────────────────────────
INSERT INTO users (
    id, organization_id, email, username, full_name,
    hashed_password, is_active, is_verified, is_superuser
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'admin@inso.local',
    'admin',
    'System Administrator',
    -- bcrypt hash of 'Admin123!'  (rounds=12) - replace after first login
    '$2b$12$HSYbtKxVWI2d27CFsp8R4.eDLZDkw9wmbkL9WhXVdizXOd2ayGWVa',
    TRUE,
    TRUE,
    TRUE
);

-- Assign super_admin role to default admin
INSERT INTO user_roles (user_id, role_id)
VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001'
);

-- ────────────────────────────────────────────────────────────
-- Seed: Common MITRE ATT&CK Techniques (sample)
-- ────────────────────────────────────────────────────────────
INSERT INTO mitre_techniques (technique_id, name, tactic_id, tactic_name, is_subtechnique, parent_id, platforms, url) VALUES
    ('TA0001', 'Initial Access',        NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0001/'),
    ('TA0002', 'Execution',             NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0002/'),
    ('TA0003', 'Persistence',           NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0003/'),
    ('TA0004', 'Privilege Escalation',  NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0004/'),
    ('TA0005', 'Defense Evasion',       NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0005/'),
    ('TA0006', 'Credential Access',     NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0006/'),
    ('TA0007', 'Discovery',             NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0007/'),
    ('TA0008', 'Lateral Movement',      NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0008/'),
    ('TA0009', 'Collection',            NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0009/'),
    ('TA0010', 'Exfiltration',          NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0010/'),
    ('TA0011', 'Command and Control',   NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0011/'),
    ('TA0040', 'Impact',                NULL, NULL, FALSE, NULL, '{}', 'https://attack.mitre.org/tactics/TA0040/'),
    ('T1059',  'Command and Scripting Interpreter', 'TA0002', 'Execution', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1059/'),
    ('T1059.001', 'PowerShell',         'TA0002', 'Execution', TRUE, 'T1059',
     ARRAY['Windows'], 'https://attack.mitre.org/techniques/T1059/001/'),
    ('T1059.003', 'Windows Command Shell', 'TA0002', 'Execution', TRUE, 'T1059',
     ARRAY['Windows'], 'https://attack.mitre.org/techniques/T1059/003/'),
    ('T1059.006', 'Python',             'TA0002', 'Execution', TRUE, 'T1059',
     ARRAY['Linux','macOS','Windows'], 'https://attack.mitre.org/techniques/T1059/006/'),
    ('T1078',  'Valid Accounts',        'TA0001', 'Initial Access', FALSE, NULL,
     ARRAY['Windows','Linux','macOS','Cloud'], 'https://attack.mitre.org/techniques/T1078/'),
    ('T1110',  'Brute Force',           'TA0006', 'Credential Access', FALSE, NULL,
     ARRAY['Windows','Linux','macOS','Cloud'], 'https://attack.mitre.org/techniques/T1110/'),
    ('T1110.001', 'Password Guessing',  'TA0006', 'Credential Access', TRUE, 'T1110',
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1110/001/'),
    ('T1021',  'Remote Services',       'TA0008', 'Lateral Movement', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1021/'),
    ('T1021.001', 'Remote Desktop Protocol', 'TA0008', 'Lateral Movement', TRUE, 'T1021',
     ARRAY['Windows'], 'https://attack.mitre.org/techniques/T1021/001/'),
    ('T1566',  'Phishing',              'TA0001', 'Initial Access', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1566/'),
    ('T1566.001', 'Spearphishing Attachment', 'TA0001', 'Initial Access', TRUE, 'T1566',
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1566/001/'),
    ('T1486',  'Data Encrypted for Impact', 'TA0040', 'Impact', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1486/'),
    ('T1003',  'OS Credential Dumping', 'TA0006', 'Credential Access', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1003/'),
    ('T1003.001', 'LSASS Memory',       'TA0006', 'Credential Access', TRUE, 'T1003',
     ARRAY['Windows'], 'https://attack.mitre.org/techniques/T1003/001/'),
    ('T1055',  'Process Injection',     'TA0004', 'Privilege Escalation', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1055/'),
    ('T1071',  'Application Layer Protocol', 'TA0011', 'Command and Control', FALSE, NULL,
     ARRAY['Windows','Linux','macOS'], 'https://attack.mitre.org/techniques/T1071/'),
    ('T1190',  'Exploit Public-Facing Application', 'TA0001', 'Initial Access', FALSE, NULL,
     ARRAY['Windows','Linux','macOS','Network'], 'https://attack.mitre.org/techniques/T1190/');

-- ────────────────────────────────────────────────────────────
-- Seed: Sample System Threat Feed entries
-- ────────────────────────────────────────────────────────────
INSERT INTO threat_feeds (
    id, organization_id, name, description, feed_type, url,
    is_enabled, is_system, poll_interval_secs, confidence, tlp_level
) VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Abuse.ch URLhaus',
        'Malware URLs collected by URLhaus',
        'txt',
        'https://urlhaus.abuse.ch/downloads/csv_recent/',
        TRUE, TRUE, 3600, 80, 'white'
    ),
    (
        'd0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Emerging Threats - Compromised IPs',
        'Known compromised and attacking IPs from Emerging Threats',
        'txt',
        'https://rules.emergingthreats.net/blockrules/compromised-ips.txt',
        TRUE, TRUE, 7200, 75, 'white'
    ),
    (
        'd0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Feodo Tracker C2',
        'Feodo Tracker botnet C2 IPs',
        'json',
        'https://feodotracker.abuse.ch/downloads/ipblocklist.json',
        TRUE, TRUE, 3600, 90, 'white'
    );

-- ────────────────────────────────────────────────────────────
-- Seed: Sample Detection Rules
-- ────────────────────────────────────────────────────────────
INSERT INTO detection_rules (
    id, organization_id, name, description, rule_type, rule_language,
    rule_content, severity, confidence, is_enabled, is_system,
    mitre_tactics, mitre_techniques, tags, dedup_window_secs
) VALUES
    (
        'e0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Multiple Failed SSH Login Attempts',
        'Detects more than 10 failed SSH authentication attempts from the same source IP within 5 minutes',
        'sigma', 'yaml',
        E'title: Multiple Failed SSH Login Attempts\nid: e0000000-0000-0000-0000-000000000001\nstatus: production\ndescription: >\n  More than 10 failed SSH authentication attempts in 5 minutes\n  from the same source IP, suggesting brute force activity.\nlogsource:\n  category: authentication\n  product: linux\ndetection:\n  selection:\n    event.type: authentication_failure\n    process.name: sshd\n  timeframe: 5m\n  condition: selection | count() by src.ip > 10\nfalsepositives:\n  - Misconfigured automation\n  - Password rotation scripts\nlevel: high',
        'high', 85, TRUE, TRUE,
        ARRAY['TA0006'], ARRAY['T1110','T1110.001'],
        ARRAY['brute-force','ssh','linux','authentication'],
        300
    ),
    (
        'e0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'PowerShell Suspicious Encoded Command',
        'Detects PowerShell execution with -EncodedCommand flag, commonly used to obfuscate malicious payloads',
        'sigma', 'yaml',
        E'title: PowerShell Encoded Command Execution\nid: e0000000-0000-0000-0000-000000000002\nstatus: production\nlogsource:\n  category: process_creation\n  product: windows\ndetection:\n  selection:\n    Image|endswith: powershell.exe\n    CommandLine|contains:\n      - -EncodedCommand\n      - -enc \n      - -ec \nfalsepositives:\n  - Legitimate administrative scripts\nlevel: high',
        'high', 80, TRUE, TRUE,
        ARRAY['TA0002'], ARRAY['T1059','T1059.001'],
        ARRAY['powershell','windows','obfuscation','defense-evasion'],
        60
    ),
    (
        'e0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'LSASS Memory Access',
        'Detects process access to LSASS memory which is commonly used for credential dumping',
        'sigma', 'yaml',
        E'title: LSASS Memory Access\nid: e0000000-0000-0000-0000-000000000003\nstatus: production\nlogsource:\n  category: process_access\n  product: windows\ndetection:\n  selection:\n    TargetImage|endswith: lsass.exe\n    GrantedAccess|contains:\n      - ''0x1010''\n      - ''0x1038''\n      - ''0x1fffff''\nfalsepositives:\n  - Security software\n  - Antivirus products\nlevel: critical',
        'critical', 90, TRUE, TRUE,
        ARRAY['TA0006'], ARRAY['T1003','T1003.001'],
        ARRAY['credential-dumping','lsass','windows','mimikatz'],
        120
    );

-- Grant ownership of all sequences and tables to the current role
-- (handled automatically by PostgreSQL for the user running this script)
