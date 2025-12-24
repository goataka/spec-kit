import { dynamoDBClient } from '../src/dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const env = process.env.NODE_ENV || 'dev';

async function seedData() {
  try {
    // Create admin user
    const adminUserId = uuidv4();
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    console.log('Creating admin user...');
    await dynamoDBClient.send(
      new PutCommand({
        TableName: `Users-${env}`,
        Item: {
          userId: adminUserId,
          email: 'admin@example.com',
          password: hashedPassword,
          name: '管理者',
          role: 'ADMIN',
          employeeId: 'EMP001',
          department: 'IT',
          position: 'System Administrator',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: adminUserId,
          updatedBy: adminUserId,
        },
      })
    );
    console.log('✅ Admin user created');
    console.log('   Email: admin@example.com');
    console.log('   Password: Admin@123');

    // Create employee user
    const employeeUserId = uuidv4();
    const employeePassword = await bcrypt.hash('Employee@123', 10);

    console.log('Creating employee user...');
    await dynamoDBClient.send(
      new PutCommand({
        TableName: `Users-${env}`,
        Item: {
          userId: employeeUserId,
          email: 'employee@example.com',
          password: employeePassword,
          name: '従業員',
          role: 'EMPLOYEE',
          employeeId: 'EMP002',
          department: 'Sales',
          position: 'Sales Representative',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: adminUserId,
          updatedBy: adminUserId,
        },
      })
    );
    console.log('✅ Employee user created');
    console.log('   Email: employee@example.com');
    console.log('   Password: Employee@123');

    console.log('✅ Seed data created successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

seedData();
