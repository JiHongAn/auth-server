import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(5, 12)
  id: string;

  @IsEmail()
  @Length(4, 30)
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsString()
  code: string;

  @IsString()
  @Length(3, 10)
  nickname: string;
}
