#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DynamoDBStack } from '../lib/dev/dynamodb-stack';
import { CognitoStack } from '../lib/dev/cognito-stack';
import { ApiGatewayStack } from '../lib/dev/apigateway-stack';
import { FrontendStack } from '../lib/dev/frontend-stack';
import { WebsiteStack } from '../lib/dev/website-stack';
import { CacheStack } from '../lib/dev/cache-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'ap-northeast-1',
};

// Development Environment
const dynamoDBStack = new DynamoDBStack(app, 'AttendanceDevDynamoDBStack', {
  env,
  stackName: 'attendance-dev-dynamodb',
  environment: 'dev',
});

const cognitoStack = new CognitoStack(app, 'AttendanceDevCognitoStack', {
  env,
  stackName: 'attendance-dev-cognito',
  environment: 'dev',
});

const cacheStack = new CacheStack(app, 'AttendanceDevCacheStack', {
  env,
  stackName: 'attendance-dev-cache',
  environment: 'dev',
});

const apiGatewayStack = new ApiGatewayStack(app, 'AttendanceDevApiGatewayStack', {
  env,
  stackName: 'attendance-dev-api',
  environment: 'dev',
  userPoolId: cognitoStack.userPool.userPoolId,
  usersTableName: dynamoDBStack.usersTable.tableName,
  clocksTableName: dynamoDBStack.clocksTable.tableName,
});

apiGatewayStack.addDependency(dynamoDBStack);
apiGatewayStack.addDependency(cognitoStack);

const frontendStack = new FrontendStack(app, 'AttendanceDevFrontendStack', {
  env,
  stackName: 'attendance-dev-frontend',
  environment: 'dev',
});

const websiteStack = new WebsiteStack(app, 'AttendanceDevWebsiteStack', {
  env,
  stackName: 'attendance-dev-website',
  environment: 'dev',
});
