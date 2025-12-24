export const awsConfig = {
  region: process.env.AWS_REGION || 'ap-northeast-1',
  accountId: process.env.AWS_ACCOUNT_ID,
};

export const dynamoDBConfig = {
  endpoint: process.env.DYNAMODB_ENDPOINT,
  usersTable: process.env.DYNAMODB_USERS_TABLE || 'Users-dev',
  clocksTable: process.env.DYNAMODB_CLOCKS_TABLE || 'Clocks-dev',
};

export const cognitoConfig = {
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  clientId: process.env.COGNITO_CLIENT_ID,
  region: process.env.COGNITO_REGION || 'ap-northeast-1',
};
