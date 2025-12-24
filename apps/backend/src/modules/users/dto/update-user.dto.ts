import { IsString, IsOptional, IsIn } from 'class-validator';
import { USER_ROLES } from '@repo/shared';

export class UpdateUserDto {
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
  @IsIn([USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE])
  @IsOptional()
  role?: string;
}
