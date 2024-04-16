import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profileUrl?: string;

  @IsOptional()
  @IsString()
  @Length(3, 10)
  nickname?: string;
}
