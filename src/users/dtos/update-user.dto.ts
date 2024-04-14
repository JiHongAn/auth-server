import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  profileUrl?: string;

  @IsOptional()
  @IsString()
  nickname?: string;
}
