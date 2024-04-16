import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  refreshToken: string;
}

export class RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
