import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RequestEmailDto } from '../dtos/request-email.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { RefreshDto, RefreshResponseDto } from '../dtos/refresh.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { UserDto } from '../../libs/dtos/user.dto';
import { GetUser } from '../../libs/decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() params: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(params);
  }

  @Post('refresh')
  async refresh(@Body() params: RefreshDto): Promise<RefreshResponseDto> {
    return this.authService.refresh(params);
  }

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

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: UserDto): Promise<SuccessDto> {
    return this.authService.logout(user);
  }
}
