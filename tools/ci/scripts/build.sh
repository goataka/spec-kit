#!/bin/bash

set -e

echo "🔨 Building all packages..."

# Build shared packages first
echo "📦 Building shared packages..."
cd packages/shared && npm run build && cd ../..
cd packages/database && npm run build && cd ../..
cd packages/config && npm run build && cd ../..

# Build backend
echo "🔧 Building backend..."
cd apps/backend && npm run build && cd ../..

# Build frontend
echo "⚛️  Building frontend..."
cd apps/frontend && npm run build && cd ../..

# Build website
echo "🌐 Building website..."
cd apps/website && npm run build && cd ../..

# Build infrastructure
echo "☁️  Building infrastructure..."
cd infrastructure/cdk && npm run build && cd ../..

echo "✅ All builds completed successfully!"
