import { IsString } from 'class-validator';
import { RefreshResponseDto } from './refresh.dto';

export class LoginDto {
  @IsString()
  id: string;

  @IsString()
  password: string;
}

export class LoginResponseDto extends RefreshResponseDto {}
