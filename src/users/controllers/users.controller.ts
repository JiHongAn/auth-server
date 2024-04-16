import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GetUser } from '../../libs/decorators/get-user.decorator';
import { UserDto } from '../../libs/dtos/user.dto';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUser(@GetUser() user: UserDto): Promise<UserDto> {
    return user;
  }

  @Patch()
  @UseGuards(JwtGuard)
  async updateUser(
    @GetUser() user: UserDto,
    @Body() params: UpdateUserDto,
  ): Promise<SuccessDto> {
    return this.usersService.updateUser(user, params);
  }

  @Get('ids')
  @UseGuards(JwtGuard)
  async getUserByIds(@Query('userIds') userIds: string): Promise<UserDto[]> {
    return this.usersService.getUserByIds(userIds);
  }

  @Get('finds')
  @UseGuards(JwtGuard)
  async findUserByIds(@Query('query') query: string): Promise<UserDto[]> {
    return this.usersService.findUserByIds(query);
  }
}
