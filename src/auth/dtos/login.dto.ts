import { IsString, Length } from 'class-validator';
import { RefreshResponseDto } from './refresh.dto';

export class LoginDto {
  @IsString()
  @Length(5, 12)
  id: string;

  @IsString()
  @Length(5, 20)
  password: string;
}

export class LoginResponseDto extends RefreshResponseDto {}
