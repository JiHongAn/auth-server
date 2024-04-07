import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 10)
  password: string;

  @IsString()
  code: string;

  @IsString()
  @Length(3, 10)
  nickname: string;
}
