# ==============================================================
# FILE: flask-backend/Dockerfile
# ==============================================================
# OWNER:        Team Member 3 (DevOps / Infrastructure Engineer)
# TECHNOLOGIES: Docker, Python 3.11 (slim), Gunicorn, pip,
#               Multi-Stage Build, Non-Root User Security
#
# INSTRUCTIONS FOR TEAM MEMBER 3:
# ─────────────────────────────────────────────────────────────
# This Dockerfile builds the Flask Python analytics backend into
# a production-ready container using a multi-stage build strategy.
# The slim-bullseye base keeps the image lightweight while
# supporting C-extension packages (like Pillow and lxml).
#
# STEPS TO IMPLEMENT:
#
# Stage 1 — Builder (install dependencies with build tools):
#   FROM python:3.11-slim-bullseye AS builder
#   - Install system build dependencies needed to compile C extensions:
#       RUN apt-get update && apt-get install -y --no-install-recommends \
#           build-essential \
#           libpq-dev \
#           curl \
#           && rm -rf /var/lib/apt/lists/*
#     (build-essential provides gcc and make for packages like
#     Pillow, cryptography, and Shapely that require compilation.)
#   - Set working directory: WORKDIR /app
#   - Upgrade pip:
#       RUN pip install --upgrade pip
#   - Copy requirements.txt and install into a target directory
#     (for copying to the final stage):
#       COPY requirements.txt .
#       RUN pip install --no-cache-dir --prefix=/install -r requirements.txt
#     (--prefix=/install installs packages to /install instead of
#     the system Python, so they can be cleanly copied to Stage 2.)
#
# Stage 2 — Development:
#   FROM python:3.11-slim-bullseye AS development
#   - WORKDIR /app
#   - Copy ALL installed packages from the builder:
#       COPY --from=builder /install /usr/local
#   - COPY . .
#   - EXPOSE 5001
#   - CMD ["python", "wsgi.py"]
#     (Flask's Werkzeug dev server with debug=True and auto-reload.)
#
# Stage 3 — Production:
#   FROM python:3.11-slim-bullseye AS production
#   - Install only the RUNTIME system dependencies (no build tools):
#       RUN apt-get update && apt-get install -y --no-install-recommends \
#           libpq5 \
#           && rm -rf /var/lib/apt/lists/*
#   - Copy installed Python packages from builder:
#       COPY --from=builder /install /usr/local
#   - Set WORKDIR: WORKDIR /app
#   - COPY . .
#   - Create a non-root user and switch to it:
#       RUN useradd --create-home --shell /bin/bash passcraft
#       USER passcraft
#     (Running containers as root is a security vulnerability.)
#   - Set production environment variables:
#       ENV FLASK_ENV=production
#       ENV PYTHONDONTWRITEBYTECODE=1   (no .pyc files)
#       ENV PYTHONUNBUFFERED=1          (stdout/stderr not buffered — critical
#                                        for Docker log streaming)
#   - EXPOSE 5001
#   - Run with Gunicorn:
#       CMD ["gunicorn", \
#            "--bind", "0.0.0.0:5001", \
#            "--workers", "4", \
#            "--timeout", "120", \
#            "--access-logfile", "-", \
#            "--error-logfile", "-", \
#            "wsgi:application"]
#
# .dockerignore file (create separately):
#   Team Member 3 must also create flask-backend/.dockerignore:
#     __pycache__
#     *.pyc
#     *.pyo
#     .env
#     .git
#     venv/
#     .venv/
#     *.md
#     .pytest_cache/
#
# Build & Run:
#   Development:
#     docker build --target development -t passcraft-flask:dev .
#     docker run -p 5001:5001 --env-file .env passcraft-flask:dev
#
#   Production:
#     docker build --target production -t passcraft-flask:latest .
#     docker run -p 5001:5001 --env-file .env passcraft-flask:latest
# ==============================================================
