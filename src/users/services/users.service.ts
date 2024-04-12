import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/services/prisma.service';
import { UserDto } from '../../libs/dtos/user.dto';
import { GetUserByIdDto } from '../dtos/get-user-by-id.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByIds(
    user: UserDto,
    { userIds }: GetUserByIdDto,
  ): Promise<UserDto[]> {
    const splitIds = userIds.split(',');

    const users = await this.prismaService.users.findMany({
      where: {
        id: { in: splitIds.map((id) => +id) },
      },
      select: {
        id: true,
        nickname: true,
        profileUrl: true,
      },
    });
    return users;
  }
}
