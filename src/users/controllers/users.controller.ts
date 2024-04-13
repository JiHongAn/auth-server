import { Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GetUser } from '../../libs/decorators/get-user.decorator';
import { UserDto } from '../../libs/dtos/user.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { GetUserResponseDto } from '../dtos/get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUser(@GetUser() user: UserDto): Promise<GetUserResponseDto> {
    return this.usersService.getUser(user);
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateUser(@GetUser() user: UserDto): Promise<SuccessDto> {
    return this.usersService.updateUser(user);
  }

  @Get('ids')
  @UseGuards(JwtGuard)
  async getUserByIds(@Query() params: GetUserByIdDto): Promise<UserDto[]> {
    return this.usersService.getUserByIds(params);
  }
}
