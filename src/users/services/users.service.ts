import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UserDto } from '../../libs/dtos/user.dto';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Update User
   */
  async updateUser(
    { id }: UserDto,
    { nickname, profileUrl }: UpdateUserDto,
  ): Promise<SuccessDto> {
    await this.prismaService.users.updateMany({
      where: { id },
      data: { nickname, profileUrl },
    });
    return { success: true };
  }

  /**
   * Get User By Ids
   */
  async getUserByIds(userIds: string): Promise<UserDto[]> {
    const splitIds = userIds.split(',');

    return this.prismaService.users.findMany({
      where: {
        id: { in: splitIds.map((id) => id) },
      },
      select: {
        id: true,
        nickname: true,
        profileUrl: true,
      },
    });
  }

  /**
   * Find User By Ids
   */
  async findUserByIds(query: string): Promise<UserDto[]> {
    return this.prismaService.users.findMany({
      where: {
        id: { startsWith: query },
      },
      select: {
        id: true,
        nickname: true,
        profileUrl: true,
      },
      take: 30,
    });
  }
}
