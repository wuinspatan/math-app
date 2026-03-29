#!/usr/bin/env bash
# Start the FastAPI backend in development mode (auto-reload on file changes)
set -e

cd "$(dirname "$0")/../backend"

# Activate the virtual environment created by the Nix shell hook
source .venv/bin/activate

echo "   Starting FastAPI on http://localhost:8000"
echo "   Docs available at http://localhost:8000/docs"
echo ""

uvicorn main:app --reload --host 0.0.0.0 --port 8000
