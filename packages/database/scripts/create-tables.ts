import { 
  CreateTableCommand, 
  DynamoDBClient,
  BillingMode,
  KeyType,
  ScalarAttributeType,
  ProjectionType,
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-1',
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
});

const env = process.env.NODE_ENV || 'dev';

async function createTables() {
  try {
    // Create Users table
    console.log('Creating Users table...');
    await client.send(
      new CreateTableCommand({
        TableName: `Users-${env}`,
        KeySchema: [
          { AttributeName: 'userId', KeyType: KeyType.HASH },
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'role', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'email', AttributeType: ScalarAttributeType.S },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'role-index',
            KeySchema: [
              { AttributeName: 'role', KeyType: KeyType.HASH },
              { AttributeName: 'email', KeyType: KeyType.RANGE },
            ],
            Projection: { ProjectionType: ProjectionType.ALL },
          },
        ],
        BillingMode: BillingMode.PAY_PER_REQUEST,
      })
    );
    console.log('✅ Users table created');

    // Create Clocks table
    console.log('Creating Clocks table...');
    await client.send(
      new CreateTableCommand({
        TableName: `Clocks-${env}`,
        KeySchema: [
          { AttributeName: 'userId', KeyType: KeyType.HASH },
          { AttributeName: 'timestamp', KeyType: KeyType.RANGE },
        ],
        AttributeDefinitions: [
          { AttributeName: 'userId', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'timestamp', AttributeType: ScalarAttributeType.S },
          { AttributeName: 'date', AttributeType: ScalarAttributeType.S },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: 'date-timestamp-index',
            KeySchema: [
              { AttributeName: 'date', KeyType: KeyType.HASH },
              { AttributeName: 'timestamp', KeyType: KeyType.RANGE },
            ],
            Projection: { ProjectionType: ProjectionType.ALL },
          },
        ],
        BillingMode: BillingMode.PAY_PER_REQUEST,
      })
    );
    console.log('✅ Clocks table created');

    console.log('✅ All tables created successfully!');
  } catch (error: any) {
    if (error.name === 'ResourceInUseException') {
      console.log('⚠️  Tables already exist');
    } else {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
  }
}

createTables();
