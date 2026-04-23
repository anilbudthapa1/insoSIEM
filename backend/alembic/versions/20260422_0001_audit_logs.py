"""create audit logs table

Revision ID: 20260422_0001
Revises:
Create Date: 2026-04-22 07:10:00 UTC
"""

from __future__ import annotations

from alembic import op

revision = "20260422_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS audit_logs (
            id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
            user_id         UUID REFERENCES users (id) ON DELETE SET NULL,
            session_id      TEXT,
            action          VARCHAR(100) NOT NULL,
            resource_type   VARCHAR(100),
            resource_id     TEXT,
            old_value       JSONB,
            new_value       JSONB,
            ip_address      INET,
            user_agent      TEXT,
            request_id      TEXT,
            outcome         VARCHAR(20) NOT NULL DEFAULT 'success',
            error_message   TEXT,
            duration_ms     INTEGER,
            metadata        JSONB NOT NULL DEFAULT '{}',
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_organization_id ON audit_logs (organization_id)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs (resource_type, resource_id)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON audit_logs (ip_address)")
    op.execute("CREATE INDEX IF NOT EXISTS idx_audit_logs_outcome ON audit_logs (outcome)")


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_outcome")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_ip_address")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_created_at")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_resource")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_action")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_user_id")
    op.execute("DROP INDEX IF EXISTS idx_audit_logs_organization_id")
    op.execute("DROP TABLE IF EXISTS audit_logs")
