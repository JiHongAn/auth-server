import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @Length(4, 30)
  email: string;

  @IsString()
  code: string;
}
