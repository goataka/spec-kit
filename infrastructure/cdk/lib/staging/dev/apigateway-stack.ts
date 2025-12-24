import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

interface ApiGatewayStackProps extends cdk.StackProps {
  environment: string;
  userPoolId: string;
  usersTableName: string;
  clocksTableName: string;
}

export class ApiGatewayStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    // Lambda Function for Backend
    const backendFunction = new lambda.Function(this, 'BackendFunction', {
      functionName: `attendance-${props.environment}-backend`,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../../apps/backend/dist')),
      timeout: cdk.Duration.seconds(25),
      memorySize: 256,
      environment: {
        NODE_ENV: props.environment,
        DYNAMODB_USERS_TABLE: props.usersTableName,
        DYNAMODB_CLOCKS_TABLE: props.clocksTableName,
        COGNITO_USER_POOL_ID: props.userPoolId,
        JWT_SECRET: process.env.JWT_SECRET || 'change-this-in-production',
        JWT_EXPIRES_IN: '7d',
      },
    });

    // Grant DynamoDB permissions
    backendFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
        'dynamodb:Query',
        'dynamodb:Scan',
      ],
      resources: [
        `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.usersTableName}`,
        `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.usersTableName}/index/*`,
        `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.clocksTableName}`,
        `arn:aws:dynamodb:${this.region}:${this.account}:table/${props.clocksTableName}/index/*`,
      ],
    }));

    // Grant Cognito permissions
    backendFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'cognito-idp:AdminCreateUser',
        'cognito-idp:AdminSetUserPassword',
        'cognito-idp:AdminGetUser',
        'cognito-idp:AdminUpdateUserAttributes',
      ],
      resources: [`arn:aws:cognito-idp:${this.region}:${this.account}:userpool/*`],
    }));

    // API Gateway
    this.api = new apigateway.RestApi(this, 'AttendanceApi', {
      restApiName: `attendance-${props.environment}-api`,
      description: 'Attendance Management System API',
      deployOptions: {
        stageName: props.environment,
        throttlingBurstLimit: 100,
        throttlingRateLimit: 50,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Lambda Integration
    const integration = new apigateway.LambdaIntegration(backendFunction);

    // API Resources
    const apiV1 = this.api.root.addResource('api').addResource('v1');
    apiV1.addProxy({
      defaultIntegration: integration,
      anyMethod: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      exportName: `${props.environment}-ApiUrl`,
    });
  }
}
