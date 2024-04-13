import { IsString, Length } from 'class-validator';
import { RefreshResponseDto } from './refresh.dto';

export class LoginDto {
  @IsString()
  id: string;

  @IsString()
  @Length(5, 30)
  password: string;
}

export class LoginResponseDto extends RefreshResponseDto {}
