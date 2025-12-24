import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class QueryClocksDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  @IsIn(['CHECK_IN', 'CHECK_OUT'])
  type?: string;

  @IsOptional()
  @IsString()
  date?: string; // YYYY-MM-DD format

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
