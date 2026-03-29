#!/usr/bin/env bash
# Start the Next.js frontend in development mode
set -e

cd "$(dirname "$0")/../frontend"

# Copy .env.local.example if .env.local doesn't exist yet
if [ ! -f .env.local ]; then
  cp .env.local.example .env.local
  echo "  Created .env.local from example (pointing to localhost:8000)"
fi

echo "   Starting Next.js on http://localhost:3000"
echo ""

npm run dev
