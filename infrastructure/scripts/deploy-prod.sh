#!/bin/bash

set -e

echo "🚀 Deploying to Production Environment..."

cd "$(dirname "$0")/../cdk"

# Check AWS credentials
if ! aws sts get-caller-identity --profile attendance-prod &> /dev/null; then
    echo "❌ AWS credentials not found for profile 'attendance-prod'"
    echo "Please run: aws configure --profile attendance-prod"
    exit 1
fi

# Bootstrap CDK (if not already done)
echo "📦 Bootstrapping CDK..."
npx cdk bootstrap --profile attendance-prod || true

# Synthesize CloudFormation template
echo "🔨 Synthesizing CDK stacks..."
npx cdk synth --profile attendance-prod

# Deploy all stacks (requires manual approval for production)
echo "☁️  Deploying all stacks..."
npx cdk deploy --profile attendance-prod --all

echo "✅ Deployment to production environment completed!"
