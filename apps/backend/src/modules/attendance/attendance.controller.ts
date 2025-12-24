import { 
  Controller, 
  Post, 
  Get, 
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Clock, USER_ROLES } from '@repo/shared';
import { QueryClocksDto } from './dto/query-clocks.dto';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @HttpCode(HttpStatus.CREATED)
  async checkIn(@Request() req: any): Promise<Clock> {
    return this.attendanceService.checkIn(req.user.userId);
  }

  @Post('check-out')
  @HttpCode(HttpStatus.OK)
  async checkOut(@Request() req: any): Promise<Clock> {
    return this.attendanceService.checkOut(req.user.userId);
  }

  @Get('clocks')
  async getClocks(
    @Request() req: any,
    @Query() queryDto: QueryClocksDto,
  ): Promise<Clock[]> {
    // Employees can only see their own records
    if (req.user.role === USER_ROLES.EMPLOYEE) {
      return this.attendanceService.getUserClocks(req.user.userId, queryDto);
    }
    
    // Admins can see all records or specific user records
    if (queryDto.userId) {
      return this.attendanceService.getUserClocks(queryDto.userId, queryDto);
    }
    
    return this.attendanceService.getAllClocks(queryDto);
  }

  @Get('clocks/today')
  async getTodayClocks(@Request() req: any): Promise<Clock[]> {
    return this.attendanceService.getTodayClocks(req.user.userId);
  }

  @Get('clocks/admin')
  @Roles(USER_ROLES.ADMIN)
  async getAllClocksAdmin(@Query() queryDto: QueryClocksDto): Promise<Clock[]> {
    return this.attendanceService.getAllClocks(queryDto);
  }
}
