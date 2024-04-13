import { IsString } from 'class-validator';

export class GetUserByIdDto {
  @IsString()
  userIds: string;
}
