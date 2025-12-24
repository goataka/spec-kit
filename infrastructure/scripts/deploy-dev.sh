#!/bin/bash

set -e

echo "🚀 Deploying to Development Environment..."

cd "$(dirname "$0")/../cdk"

# Check AWS credentials
if ! aws sts get-caller-identity --profile attendance-dev &> /dev/null; then
    echo "❌ AWS credentials not found for profile 'attendance-dev'"
    echo "Please run: aws configure --profile attendance-dev"
    exit 1
fi

# Bootstrap CDK (if not already done)
echo "📦 Bootstrapping CDK..."
npx cdk bootstrap --profile attendance-dev || true

# Synthesize CloudFormation template
echo "🔨 Synthesizing CDK stacks..."
npx cdk synth --profile attendance-dev

# Deploy all stacks
echo "☁️  Deploying all stacks..."
npx cdk deploy --profile attendance-dev --all --require-approval never

echo "✅ Deployment to development environment completed!"
