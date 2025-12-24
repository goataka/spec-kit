import { 
  Injectable, 
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { dynamoDBClient, getTableName } from '@repo/database';
import { GetCommand, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { User, CreateUserDto, UpdateUserDto, ERROR_CODES } from '@repo/shared';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private readonly usersTable = getTableName('Users');

  async create(createUserDto: CreateUserDto, createdBy: string): Promise<Omit<User, 'password'>> {
    const { email, password, name, role, department, position, employeeId } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();

    const user: User = {
      userId,
      email,
      password: hashedPassword,
      name,
      role,
      department: department || 'General',
      position: position || 'Employee',
      employeeId: employeeId || await this.generateEmployeeId(),
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    try {
      await dynamoDBClient.send(
        new PutCommand({
          TableName: this.usersTable,
          Item: user,
          ConditionExpression: 'attribute_not_exists(userId)',
        })
      );
    } catch (error: any) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to create user',
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
        })
      );

      const users = (result.Items || []) as User[];
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch users',
      });
    }
  }

  async findOne(userId: string): Promise<Omit<User, 'password'>> {
    try {
      const result = await dynamoDBClient.send(
        new GetCommand({
          TableName: this.usersTable,
          Key: { userId },
        })
      );

      if (!result.Item) {
        throw new NotFoundException({
          code: ERROR_CODES.USER_NOT_FOUND,
          message: 'User not found',
        });
      }

      const { password, ...userWithoutPassword } = result.Item as User;
      return userWithoutPassword;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch user',
      });
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    updatedBy: string
  ): Promise<Omit<User, 'password'>> {
    const updates: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (updateUserDto.name !== undefined) {
      updates.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = updateUserDto.name;
    }

    if (updateUserDto.department !== undefined) {
      updates.push('#department = :department');
      expressionAttributeNames['#department'] = 'department';
      expressionAttributeValues[':department'] = updateUserDto.department;
    }

    if (updateUserDto.position !== undefined) {
      updates.push('#position = :position');
      expressionAttributeNames['#position'] = 'position';
      expressionAttributeValues[':position'] = updateUserDto.position;
    }

    if (updateUserDto.role !== undefined) {
      updates.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = updateUserDto.role;
    }

    // Always update audit fields
    updates.push('#updatedAt = :updatedAt', '#updatedBy = :updatedBy');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeNames['#updatedBy'] = 'updatedBy';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    expressionAttributeValues[':updatedBy'] = updatedBy;

    if (updates.length === 2) {
      // Only audit fields, nothing to update
      return this.findOne(userId);
    }

    try {
      const result = await dynamoDBClient.send(
        new UpdateCommand({
          TableName: this.usersTable,
          Key: { userId },
          UpdateExpression: `SET ${updates.join(', ')}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: 'ALL_NEW',
        })
      );

      const { password, ...userWithoutPassword } = result.Attributes as User;
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to update user',
      });
    }
  }

  private async generateEmployeeId(): Promise<string> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          Select: 'COUNT',
        })
      );

      const count = result.Count || 0;
      const employeeNumber = (count + 1).toString().padStart(3, '0');
      return `EMP${employeeNumber}`;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to generate employee ID',
      });
    }
  }
}
