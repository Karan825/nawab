#!/usr/bin/env bash
set -e

echo "🔄 Running database migrations..."
alembic upgrade head

echo "🌱 Seeding 17 Hyderabad outlets, menu, and reviewer accounts..."
python scripts/seed.py

echo "🚀 Starting Uvicorn server on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
