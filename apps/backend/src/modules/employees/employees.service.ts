import { 
  Injectable, 
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { dynamoDBClient, getTableName } from '@repo/database';
import { GetCommand, ScanCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, ERROR_CODES } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EmployeesService {
  private readonly usersTable = getTableName('Users');

  async create(createEmployeeDto: CreateEmployeeDto, createdBy: string): Promise<Employee> {
    const { 
      name, 
      employeeNumber, 
      department, 
      position, 
      hireDate,
      employmentType,
    } = createEmployeeDto;

    // Check if employee number already exists
    if (employeeNumber) {
      const existing = await this.findByEmployeeNumber(employeeNumber);
      if (existing) {
        throw new ConflictException({
          code: ERROR_CODES.EMPLOYEE_ALREADY_EXISTS,
          message: 'Employee number already exists',
        });
      }
    }

    const userId = uuidv4();
    const now = new Date().toISOString();

    const employee: Employee = {
      userId,
      name,
      employeeNumber: employeeNumber || await this.generateEmployeeNumber(),
      department: department || 'General',
      position: position || 'Employee',
      hireDate: hireDate || now,
      employmentType: employmentType || 'FULL_TIME',
      role: 'EMPLOYEE',
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };

    try {
      await dynamoDBClient.send(
        new PutCommand({
          TableName: this.usersTable,
          Item: employee,
          ConditionExpression: 'attribute_not_exists(userId)',
        })
      );
    } catch (error: any) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to create employee',
      });
    }

    return employee;
  }

  async findAll(): Promise<Employee[]> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          FilterExpression: '#role = :role',
          ExpressionAttributeNames: {
            '#role': 'role',
          },
          ExpressionAttributeValues: {
            ':role': 'EMPLOYEE',
          },
        })
      );

      return (result.Items || []) as Employee[];
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch employees',
      });
    }
  }

  async findOne(userId: string): Promise<Employee> {
    try {
      const result = await dynamoDBClient.send(
        new GetCommand({
          TableName: this.usersTable,
          Key: { userId },
        })
      );

      if (!result.Item) {
        throw new NotFoundException({
          code: ERROR_CODES.EMPLOYEE_NOT_FOUND,
          message: 'Employee not found',
        });
      }

      return result.Item as Employee;
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch employee',
      });
    }
  }

  async findByEmployeeNumber(employeeNumber: string): Promise<Employee | null> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          FilterExpression: 'employeeNumber = :employeeNumber',
          ExpressionAttributeValues: {
            ':employeeNumber': employeeNumber,
          },
          Limit: 1,
        })
      );

      return result.Items?.[0] as Employee | null;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to query employee',
      });
    }
  }

  async update(
    userId: string,
    updateEmployeeDto: UpdateEmployeeDto,
    updatedBy: string
  ): Promise<Employee> {
    const updates: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    if (updateEmployeeDto.name !== undefined) {
      updates.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = updateEmployeeDto.name;
    }

    if (updateEmployeeDto.department !== undefined) {
      updates.push('#department = :department');
      expressionAttributeNames['#department'] = 'department';
      expressionAttributeValues[':department'] = updateEmployeeDto.department;
    }

    if (updateEmployeeDto.position !== undefined) {
      updates.push('#position = :position');
      expressionAttributeNames['#position'] = 'position';
      expressionAttributeValues[':position'] = updateEmployeeDto.position;
    }

    if (updateEmployeeDto.employmentType !== undefined) {
      updates.push('#employmentType = :employmentType');
      expressionAttributeNames['#employmentType'] = 'employmentType';
      expressionAttributeValues[':employmentType'] = updateEmployeeDto.employmentType;
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

      return result.Attributes as Employee;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to update employee',
      });
    }
  }

  private async generateEmployeeNumber(): Promise<string> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          FilterExpression: '#role = :role',
          ExpressionAttributeNames: {
            '#role': 'role',
          },
          ExpressionAttributeValues: {
            ':role': 'EMPLOYEE',
          },
          Select: 'COUNT',
        })
      );

      const count = result.Count || 0;
      const employeeNumber = (count + 1).toString().padStart(3, '0');
      return `EMP${employeeNumber}`;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to generate employee number',
      });
    }
  }
}
