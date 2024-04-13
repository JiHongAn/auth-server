import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UserDto } from '../../libs/dtos/user.dto';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { GetUserResponseDto } from '../dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Get User
   */
  async getUser({ id }: UserDto): Promise<GetUserResponseDto> {
    return this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        profileUrl: true,
        introduction: true,
      },
    });
  }

  /**
   * Update User
   */
  async updateUser(user: UserDto): Promise<SuccessDto> {
    return undefined;
  }

  /**
   * Get User By Ids
   */
  async getUserByIds({ userIds }: GetUserByIdDto): Promise<UserDto[]> {
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
}
