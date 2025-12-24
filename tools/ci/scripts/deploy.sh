#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}

echo "🚀 Deploying to $ENVIRONMENT environment..."

# Run build first
./tools/ci/scripts/build.sh

# Deploy based on environment
case $ENVIRONMENT in
  dev)
    ./infrastructure/scripts/deploy-dev.sh
    ;;
  staging)
    ./infrastructure/scripts/deploy-staging.sh
    ;;
  prod)
    ./infrastructure/scripts/deploy-prod.sh
    ;;
  *)
    echo "❌ Unknown environment: $ENVIRONMENT"
    echo "Usage: ./tools/ci/scripts/deploy.sh [dev|staging|prod]"
    exit 1
    ;;
esac

echo "✅ Deployment completed!"
