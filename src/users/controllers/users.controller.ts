import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GetUser } from '../../libs/decorators/get-user.decorator';
import { UserDto } from '../../libs/dtos/user.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUser(@GetUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Get('ids')
  @UseGuards(JwtGuard)
  async getUserByIds(
    @GetUser() user: UserDto,
    @Query() params: GetUserByIdDto,
  ): Promise<UserDto[]> {
    return this.usersService.getUserByIds(user, params);
  }
}
