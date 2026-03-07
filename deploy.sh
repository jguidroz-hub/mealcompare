#!/bin/bash
# Deploy eddy-delivery to Coolify
# Usage: ./deploy.sh [commit message]

set -e
cd "$(dirname "$0")"

MSG="${1:-Auto deploy}"

echo "Building..."
npm run build:web 2>&1 | tail -3

echo "Pushing..."
git add -A
git commit -m "$MSG" 2>/dev/null || echo "Nothing to commit"
git push origin eddy-rebrand 2>&1 | tail -3

echo "Triggering Coolify deploy..."
curl -s -X POST "http://178.156.240.80:8000/api/v1/deploy?uuid=cwocgwso0kwgggo008wkg0wc" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 10|sprintdeploy2026" | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'✅ Deploy queued: {d[\"deployments\"][0][\"deployment_uuid\"]}')" 2>/dev/null || echo "Deploy trigger sent"

echo "Done! Check https://eddy.delivery in ~2 minutes."
