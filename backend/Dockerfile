# =============================================================================
# Stage 1: Builder — install all Python dependencies
# =============================================================================
FROM python:3.12-slim AS builder

WORKDIR /build

# Install build tools needed by some native extensions (asyncpg, hiredis, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first so Docker can cache this layer
COPY requirements.txt .

# Install into a prefix directory so we can copy it cleanly to runtime stage
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

# =============================================================================
# Stage 2: Runtime — minimal image with non-root user
# =============================================================================
FROM python:3.12-slim AS runtime

LABEL maintainer="Inso SIEM <hypemsltech@gmail.com>"
LABEL description="Inso SIEM Backend API"
LABEL version="1.0.0"

# Runtime system dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    libssl3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder stage
COPY --from=builder /install /usr/local

# Create non-root user and group
RUN groupadd --gid 10001 inso && \
    useradd --uid 10001 --gid inso --shell /bin/bash --create-home inso

WORKDIR /app

# Copy application source
COPY --chown=inso:inso . .

# Create directories for logs, GeoIP databases, and runtime artifacts
RUN mkdir -p /app/logs /opt/geoip && chown -R inso:inso /app/logs /opt/geoip

# Switch to non-root user
USER inso

# Expose the API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
