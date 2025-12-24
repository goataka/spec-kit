import { 
  Injectable, 
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { dynamoDBClient, getTableName } from '@repo/database';
import { PutCommand, QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Clock, ERROR_CODES } from '@repo/shared';
import { v4 as uuidv4 } from 'uuid';
import { QueryClocksDto } from './dto/query-clocks.dto';

@Injectable()
export class AttendanceService {
  private readonly clocksTable = getTableName('Clocks');

  async checkIn(userId: string): Promise<Clock> {
    // Check if user already has an active check-in (no check-out)
    const todayClocks = await this.getTodayClocks(userId);
    const hasActiveCheckIn = todayClocks.some(
      clock => clock.type === 'CHECK_IN' && !clock.checkOutTime
    );

    if (hasActiveCheckIn) {
      throw new BadRequestException({
        code: ERROR_CODES.ALREADY_CHECKED_IN,
        message: 'Already checked in. Please check out first.',
      });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const clock: Clock = {
      clockId: uuidv4(),
      userId,
      type: 'CHECK_IN',
      timestamp,
      date,
      checkInTime: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: userId,
      updatedBy: userId,
    };

    try {
      await dynamoDBClient.send(
        new PutCommand({
          TableName: this.clocksTable,
          Item: clock,
        })
      );
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to record check-in',
      });
    }

    return clock;
  }

  async checkOut(userId: string): Promise<Clock> {
    // Find active check-in
    const todayClocks = await this.getTodayClocks(userId);
    const activeCheckIn = todayClocks.find(
      clock => clock.type === 'CHECK_IN' && !clock.checkOutTime
    );

    if (!activeCheckIn) {
      throw new BadRequestException({
        code: ERROR_CODES.NO_ACTIVE_CHECK_IN,
        message: 'No active check-in found. Please check in first.',
      });
    }

    const now = new Date();
    const timestamp = now.toISOString();
    const date = now.toISOString().split('T')[0];

    const clock: Clock = {
      clockId: uuidv4(),
      userId,
      type: 'CHECK_OUT',
      timestamp,
      date,
      checkInTime: activeCheckIn.checkInTime,
      checkOutTime: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: userId,
      updatedBy: userId,
    };

    try {
      await dynamoDBClient.send(
        new PutCommand({
          TableName: this.clocksTable,
          Item: clock,
        })
      );
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to record check-out',
      });
    }

    return clock;
  }

  async getUserClocks(userId: string, queryDto?: QueryClocksDto): Promise<Clock[]> {
    try {
      const params: any = {
        TableName: this.clocksTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      };

      if (queryDto?.startDate) {
        params.KeyConditionExpression += ' AND #timestamp >= :startDate';
        params.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
        params.ExpressionAttributeValues[':startDate'] = queryDto.startDate;
      }

      if (queryDto?.endDate) {
        params.KeyConditionExpression += ' AND #timestamp <= :endDate';
        params.ExpressionAttributeNames = { '#timestamp': 'timestamp' };
        params.ExpressionAttributeValues[':endDate'] = queryDto.endDate;
      }

      const result = await dynamoDBClient.send(new QueryCommand(params));
      
      let clocks = (result.Items || []) as Clock[];

      // Filter by type if specified
      if (queryDto?.type) {
        clocks = clocks.filter(clock => clock.type === queryDto.type);
      }

      return clocks.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch clock records',
      });
    }
  }

  async getTodayClocks(userId: string): Promise<Clock[]> {
    const today = new Date().toISOString().split('T')[0];
    const startOfDay = `${today}T00:00:00.000Z`;
    const endOfDay = `${today}T23:59:59.999Z`;

    return this.getUserClocks(userId, {
      startDate: startOfDay,
      endDate: endOfDay,
    });
  }

  async getAllClocks(queryDto?: QueryClocksDto): Promise<Clock[]> {
    try {
      const params: any = {
        TableName: this.clocksTable,
      };

      // If date filter is provided, use GSI
      if (queryDto?.date) {
        params.IndexName = 'date-timestamp-index';
        params.KeyConditionExpression = '#date = :date';
        params.ExpressionAttributeNames = { '#date': 'date' };
        params.ExpressionAttributeValues = { ':date': queryDto.date };
      }

      const result = queryDto?.date
        ? await dynamoDBClient.send(new QueryCommand(params))
        : await dynamoDBClient.send(new ScanCommand(params));

      let clocks = (result.Items || []) as Clock[];

      // Apply filters
      if (queryDto?.type) {
        clocks = clocks.filter(clock => clock.type === queryDto.type);
      }

      if (queryDto?.startDate) {
        clocks = clocks.filter(clock => clock.timestamp >= queryDto.startDate!);
      }

      if (queryDto?.endDate) {
        clocks = clocks.filter(clock => clock.timestamp <= queryDto.endDate!);
      }

      return clocks.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      throw new InternalServerErrorException({
        code: ERROR_CODES.DATABASE_ERROR,
        message: 'Failed to fetch all clock records',
      });
    }
  }
}
