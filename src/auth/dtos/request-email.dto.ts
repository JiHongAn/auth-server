import { IsEmail, Length } from 'class-validator';

export class RequestEmailDto {
  @IsEmail()
  @Length(4, 30)
  email: string;
}
