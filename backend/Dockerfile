# Stage 1: Build Python dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build tools required to compile any C-extensions (e.g. numpy, lightgbm)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime image
FROM python:3.11-slim AS runner

# Create a non-root system user and group
RUN groupadd --system -g 10001 appgroup && \
    useradd --system -u 10001 -g appgroup --create-home --shell /bin/bash appuser

# Install only runtime dependencies (libgomp1 is required by lightgbm)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000 \
    PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv

# Copy application files and set ownership to non-root user
COPY --chown=appuser:appgroup . /app/

# Switch to non-root user
USER appuser

EXPOSE 8000

# Start FastAPI application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
