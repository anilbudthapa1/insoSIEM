from app.config import Settings


def test_settings_accept_env_example_aliases(monkeypatch) -> None:
    monkeypatch.setenv("APP_ENV", "staging")
    monkeypatch.setenv("CLICKHOUSE_PASSWORD", "clickhouse-secret")
    monkeypatch.setenv("MINIO_USE_SSL", "true")
    monkeypatch.setenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    monkeypatch.setenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "14")
    monkeypatch.setenv("OLLAMA_BASE_URL", "http://ollama.internal:11434")
    monkeypatch.setenv("SMTP_PASSWORD", "smtp-secret")
    monkeypatch.setenv("RATE_LIMIT_AUTH_RPM", "45")

    cfg = Settings(_env_file=None)

    assert cfg.ENVIRONMENT == "staging"
    assert cfg.CLICKHOUSE_PASS == "clickhouse-secret"
    assert cfg.MINIO_SECURE is True
    assert cfg.ACCESS_TOKEN_EXPIRE_MINUTES == 30
    assert cfg.REFRESH_TOKEN_EXPIRE_DAYS == 14
    assert cfg.OLLAMA_URL == "http://ollama.internal:11434"
    assert cfg.SMTP_PASS == "smtp-secret"
    assert cfg.RATE_LIMIT_AUTH == 45
