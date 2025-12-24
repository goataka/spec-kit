#!/bin/bash

set -e

echo "🚀 Deploying to Staging Environment..."

cd "$(dirname "$0")/../cdk"

# Check AWS credentials
if ! aws sts get-caller-identity --profile attendance-staging &> /dev/null; then
    echo "❌ AWS credentials not found for profile 'attendance-staging'"
    echo "Please run: aws configure --profile attendance-staging"
    exit 1
fi

# Bootstrap CDK (if not already done)
echo "📦 Bootstrapping CDK..."
npx cdk bootstrap --profile attendance-staging || true

# Synthesize CloudFormation template
echo "🔨 Synthesizing CDK stacks..."
npx cdk synth --profile attendance-staging

# Deploy all stacks
echo "☁️  Deploying all stacks..."
npx cdk deploy --profile attendance-staging --all --require-approval never

echo "✅ Deployment to staging environment completed!"
