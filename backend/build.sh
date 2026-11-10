#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

echo "🔄 Running Alembic database migrations..."
alembic upgrade head

echo "🌱 Seeding 17 Hyderabad outlets, menu items, users, and assignment orders..."
python scripts/seed.py

echo "✅ Backend build and database initialization complete!"
