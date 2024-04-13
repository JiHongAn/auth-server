import { UserDto } from '../../libs/dtos/user.dto';

export class GetUserResponseDto extends UserDto {
  introduction?: string;
}
