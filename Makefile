# ============================================================
# Inso SIEM — Makefile
# ============================================================
SHELL := /bin/bash
.DEFAULT_GOAL := help

COMPOSE        := docker compose
BACKEND        := inso-backend
ENV_FILE       := .env
ALEMBIC        := $(COMPOSE) exec $(BACKEND) alembic

# Colours
CYAN   := \033[0;36m
YELLOW := \033[0;33m
GREEN  := \033[0;32m
RESET  := \033[0m

.PHONY: help
help: ## Show this help message
	@echo ""
	@echo "  $(CYAN)Inso SIEM — available targets$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-22s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# ────────────────────────────────────────────────────────────
# Docker lifecycle
# ────────────────────────────────────────────────────────────

.PHONY: dev
dev: check-env ## Start all services in detached mode (development)
	$(COMPOSE) up -d --build
	@echo "$(GREEN)All services started.$(RESET)"
	@echo "  Dashboard  -> http://localhost:$${HTTP_PORT:-8011}"
	@echo "  Health     -> http://localhost:$${HTTP_PORT:-8011}/health"
	@echo "  MinIO UI   -> http://localhost:9001"
	@echo "  NATS mon.  -> http://localhost:8222"

.PHONY: up
up: dev ## Alias for dev

.PHONY: down
down: ## Stop and remove containers (keep volumes)
	$(COMPOSE) down --remove-orphans

.PHONY: destroy
destroy: ## Stop containers AND remove all volumes (DATA LOSS!)
	@echo "$(YELLOW)WARNING: This will delete all persistent data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	$(COMPOSE) down --volumes --remove-orphans

.PHONY: restart
restart: down dev ## Full restart of all services

.PHONY: ps
ps: ## Show status of all containers
	$(COMPOSE) ps

# ────────────────────────────────────────────────────────────
# Logs
# ────────────────────────────────────────────────────────────

.PHONY: logs
logs: ## Tail logs for all services (Ctrl-C to stop)
	$(COMPOSE) logs -f

.PHONY: logs-backend
logs-backend: ## Tail backend logs only
	$(COMPOSE) logs -f backend

.PHONY: logs-nginx
logs-nginx: ## Tail nginx logs only
	$(COMPOSE) logs -f nginx

.PHONY: logs-postgres
logs-postgres: ## Tail postgres logs only
	$(COMPOSE) logs -f postgres

.PHONY: logs-clickhouse
logs-clickhouse: ## Tail clickhouse logs only
	$(COMPOSE) logs -f clickhouse

# ────────────────────────────────────────────────────────────
# Database / Migrations
# ────────────────────────────────────────────────────────────

.PHONY: migrate
migrate: ## Run Alembic migrations (upgrade head)
	$(ALEMBIC) upgrade head

.PHONY: migrate-down
migrate-down: ## Rollback last Alembic migration
	$(ALEMBIC) downgrade -1

.PHONY: migrate-history
migrate-history: ## Show Alembic migration history
	$(ALEMBIC) history --verbose

.PHONY: migrate-make
migrate-make: ## Create a new Alembic migration (MSG= required)
	@[ -n "$(MSG)" ] || (echo "$(YELLOW)Usage: make migrate-make MSG='your message'$(RESET)" && exit 1)
	$(ALEMBIC) revision --autogenerate -m "$(MSG)"

.PHONY: seed
seed: ## Load sample data into the database
	$(COMPOSE) exec $(BACKEND) python -m scripts.seed_data
	@echo "$(GREEN)Sample data loaded.$(RESET)"

.PHONY: psql
psql: ## Open psql shell inside postgres container
	$(COMPOSE) exec postgres psql -U $${POSTGRES_USER:-inso} -d $${POSTGRES_DB:-inso_siem}

.PHONY: clickhouse-client
clickhouse-client: ## Open clickhouse-client shell
	$(COMPOSE) exec clickhouse clickhouse-client --user $${CLICKHOUSE_USER:-inso_ch} --password $${CLICKHOUSE_PASSWORD}

# ────────────────────────────────────────────────────────────
# Testing
# ────────────────────────────────────────────────────────────

.PHONY: test
test: ## Run full test suite inside backend container
	$(COMPOSE) exec $(BACKEND) pytest tests/ -v --tb=short --cov=app --cov-report=term-missing

.PHONY: test-unit
test-unit: ## Run unit tests only
	$(COMPOSE) exec $(BACKEND) pytest tests/unit/ -v --tb=short

.PHONY: test-integration
test-integration: ## Run integration tests only
	$(COMPOSE) exec $(BACKEND) pytest tests/integration/ -v --tb=short

.PHONY: test-local
test-local: ## Run tests locally (requires local venv)
	cd backend && pytest tests/ -v --tb=short --cov=app --cov-report=term-missing

.PHONY: lint
lint: ## Run ruff + mypy linters inside backend container
	$(COMPOSE) exec $(BACKEND) ruff check app/
	$(COMPOSE) exec $(BACKEND) mypy app/

.PHONY: format
format: ## Auto-format code with ruff inside backend container
	$(COMPOSE) exec $(BACKEND) ruff format app/

# ────────────────────────────────────────────────────────────
# Build
# ────────────────────────────────────────────────────────────

.PHONY: build
build: ## Build all Docker images (no cache)
	$(COMPOSE) build --no-cache

.PHONY: build-backend
build-backend: ## Rebuild backend image only
	$(COMPOSE) build --no-cache backend

.PHONY: build-frontend
build-frontend: ## Rebuild frontend image only
	$(COMPOSE) build --no-cache frontend

# ────────────────────────────────────────────────────────────
# Shell access
# ────────────────────────────────────────────────────────────

.PHONY: shell
shell: ## Open bash shell inside the backend container
	$(COMPOSE) exec $(BACKEND) /bin/bash

.PHONY: shell-frontend
shell-frontend: ## Open sh shell inside the frontend container
	$(COMPOSE) exec frontend /bin/sh

.PHONY: redis-cli
redis-cli: ## Open redis-cli inside redis container
	$(COMPOSE) exec redis redis-cli -a $${REDIS_PASSWORD}

# ────────────────────────────────────────────────────────────
# Certificate & Key Generation
# ────────────────────────────────────────────────────────────

.PHONY: generate-keys
generate-keys: ## Generate RS256 JWT keypair and self-signed TLS cert
	@mkdir -p infra/certs
	@echo "$(CYAN)Generating RS256 JWT keypair...$(RESET)"
	openssl genrsa -out infra/certs/jwt_private.pem 4096
	openssl rsa -in infra/certs/jwt_private.pem -pubout -out infra/certs/jwt_public.pem
	chmod 600 infra/certs/jwt_private.pem
	@echo "$(CYAN)Generating self-signed TLS certificate (dev only)...$(RESET)"
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout infra/certs/nginx.key \
		-out infra/certs/nginx.crt \
		-subj "/C=US/ST=Dev/L=Dev/O=Inso SIEM/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
	chmod 600 infra/certs/nginx.key
	@echo "$(GREEN)Keys and certificates generated in infra/certs/$(RESET)"

.PHONY: generate-fernet
generate-fernet: ## Generate a Fernet encryption key for ENCRYPTION_KEY
	@python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"

.PHONY: generate-jwt-secret
generate-jwt-secret: ## Generate a 64-char random hex string for JWT_SECRET_KEY
	@python3 -c "import secrets; print(secrets.token_hex(64))"

# ────────────────────────────────────────────────────────────
# GeoIP
# ────────────────────────────────────────────────────────────

.PHONY: download-geoip
download-geoip: ## Download MaxMind GeoLite2 databases (MAXMIND_LICENSE_KEY required)
	@[ -n "$(MAXMIND_LICENSE_KEY)" ] || (echo "$(YELLOW)Set MAXMIND_LICENSE_KEY in .env or pass it: make download-geoip MAXMIND_LICENSE_KEY=xxx$(RESET)" && exit 1)
	@mkdir -p data/geoip
	curl -sL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-City&license_key=$(MAXMIND_LICENSE_KEY)&suffix=tar.gz" \
		| tar -xz -C data/geoip --strip-components=1 --wildcards "*.mmdb"
	curl -sL "https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-ASN&license_key=$(MAXMIND_LICENSE_KEY)&suffix=tar.gz" \
		| tar -xz -C data/geoip --strip-components=1 --wildcards "*.mmdb"
	@echo "$(GREEN)GeoIP databases saved to data/geoip/$(RESET)"

# ────────────────────────────────────────────────────────────
# Cleanup
# ────────────────────────────────────────────────────────────

.PHONY: clean
clean: ## Remove Docker build cache and dangling images
	docker builder prune -f
	docker image prune -f

.PHONY: clean-all
clean-all: destroy clean ## Full environment teardown (DATA LOSS!)

# ────────────────────────────────────────────────────────────
# Helpers
# ────────────────────────────────────────────────────────────

.PHONY: check-env
check-env: ## Verify .env file exists
	@[ -f $(ENV_FILE) ] || (echo "$(YELLOW)Missing $(ENV_FILE) — copy .env.example and fill in values$(RESET)" && exit 1)

.PHONY: env-setup
env-setup: ## Bootstrap .env from .env.example if it does not exist
	@[ -f $(ENV_FILE) ] && echo "$(YELLOW).env already exists — skipping$(RESET)" || (cp .env.example .env && echo "$(GREEN).env created from .env.example$(RESET)")

.PHONY: init
init: env-setup generate-keys ## First-time project setup: create .env and generate keys
	@echo "$(GREEN)Project initialised. Edit .env then run: make dev$(RESET)"
