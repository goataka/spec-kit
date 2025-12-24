import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsIn(['FULL_TIME', 'PART_TIME', 'CONTRACT'])
  @IsOptional()
  employmentType?: string;
}
