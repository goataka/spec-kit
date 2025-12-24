export const config = () => ({
  port: parseInt(process.env.API_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  aws: {
    region: process.env.AWS_REGION || 'ap-northeast-1',
    accountId: process.env.AWS_ACCOUNT_ID,
    dynamodb: {
      endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
      usersTable: process.env.DYNAMODB_USERS_TABLE || 'Users-dev',
      clocksTable: process.env.DYNAMODB_CLOCKS_TABLE || 'Clocks-dev',
    },
    cognito: {
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID,
      region: process.env.COGNITO_REGION || 'ap-northeast-1',
    },
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
});
