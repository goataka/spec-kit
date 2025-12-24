import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { dynamoDBClient, getTableName } from '@repo/database';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
  JWTPayload,
  USER_ROLES,
  ERROR_CODES,
} from '@repo/shared';

@Injectable()
export class AuthService {
  private readonly usersTable = getTableName('Users');

  constructor(private readonly jwtService: JwtService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name, department, position } = registerDto;

    // Check if user already exists
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        code: ERROR_CODES.USER_ALREADY_EXISTS,
        message: 'User with this email already exists',
      });
    }

    // Check if this is the first user (should be admin)
    const isFirstUser = await this.isFirstUser();
    const role = isFirstUser ? USER_ROLES.ADMIN : USER_ROLES.EMPLOYEE;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
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
      employeeId: await this.generateEmployeeId(),
      createdAt: now,
      updatedAt: now,
      createdBy: userId, // Self-created
      updatedBy: userId,
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
      if (error.name === 'ConditionalCheckFailedException') {
        throw new ConflictException({
          code: ERROR_CODES.USER_ALREADY_EXISTS,
          message: 'User already exists',
        });
      }
      throw new InternalServerErrorException({
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to create user',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          FilterExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email,
          },
          Limit: 1,
        })
      );

      return result.Items?.[0] as User | null;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to query user',
      });
    }
  }

  private async isFirstUser(): Promise<boolean> {
    try {
      const result = await dynamoDBClient.send(
        new ScanCommand({
          TableName: this.usersTable,
          Select: 'COUNT',
          Limit: 1,
        })
      );

      return result.Count === 0;
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to check user count',
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

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JWTPayload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
    });

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string): Promise<User> {
    try {
      const result = await dynamoDBClient.send(
        new GetCommand({
          TableName: this.usersTable,
          Key: { userId },
        })
      );

      if (!result.Item) {
        throw new UnauthorizedException({
          code: ERROR_CODES.USER_NOT_FOUND,
          message: 'User not found',
        });
      }

      return result.Item as User;
    } catch (error) {
      throw new UnauthorizedException({
        code: ERROR_CODES.INVALID_TOKEN,
        message: 'Invalid authentication token',
      });
    }
  }
}
