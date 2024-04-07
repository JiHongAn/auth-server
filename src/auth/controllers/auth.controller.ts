import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestEmailDto } from '../dtos/request-email.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() params: RegisterDto): Promise<SuccessDto> {
    return this.authService.register(params);
  }

  @Post('request-email')
  async requestEmail(@Body() params: RequestEmailDto): Promise<SuccessDto> {
    return this.authService.requestEmail(params);
  }

  @Post('verify-email')
  async verifyEmail(@Body() params: VerifyEmailDto): Promise<SuccessDto> {
    return this.authService.verifyEmail(params);
  }
}
