import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config = {
  region: process.env.AWS_REGION || 'ap-northeast-1',
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
};

const client = new DynamoDBClient(config);

export const dynamoDBClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

export const getTableName = (tableName: string): string => {
  const env = process.env.NODE_ENV || 'dev';
  return `${tableName}-${env}`;
};
