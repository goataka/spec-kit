import { 
  Controller, 
  Get, 
  Param, 
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { User, USER_ROLES } from '@repo/shared';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(USER_ROLES.ADMIN)
  async findAll(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  async getProfile(@Request() req: any): Promise<Omit<User, 'password'>> {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @Roles(USER_ROLES.ADMIN)
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.usersService.findOne(id);
  }
}
