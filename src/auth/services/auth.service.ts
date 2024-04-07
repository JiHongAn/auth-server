import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { RequestEmailDto } from '../dtos/request-email.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { SuccessDto } from '../../libs/dtos/success.dto';
import { PrismaService } from '../../prisma/services/prisma.service';
import * as bcrypt from 'bcrypt';
import { addEmailSQS } from '../../libs/utils/sqs';
import { errors } from '../../libs/errors';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { RefreshDto, RefreshResponseDto } from '../dtos/refresh.dto';
import { UserDto } from '../../libs/dtos/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Login
   */
  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nickname: true,
        password: true,
        profileUrl: true,
      },
    });

    // User를 찾을 수 없다면
    if (!user) {
      throw errors.FailedLogin();
    }

    // 비밀번호 체크
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw errors.FailedLogin();
    }

    // Token 발급
    const accessToken = this.createAccessToken({
      id: user.id,
      nickname: user.nickname,
      profileUrl: user.profileUrl,
    });
    const refreshToken = await this.createRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  /**
   * Refresh
   */
  async refresh({ refreshToken }: RefreshDto): Promise<RefreshResponseDto> {
    // Refresh 토큰 검증
    const { id } = this.validateRefreshToken(refreshToken);

    // User 조회
    const user = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        refreshToken: true,
        profileUrl: true,
      },
    });

    // User 정보가 없다면
    if (!user || user.refreshToken !== refreshToken) {
      throw errors.InvalidAccessToken();
    }

    // 새로운 Access Token
    const newAccessToken = this.createAccessToken({
      id: user.id,
      nickname: user.nickname,
      profileUrl: user.profileUrl,
    });

    // 새로운 Refresh Token
    const newRefreshToken = await this.createRefreshToken(user.id);
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Register
   */
  async register({
    email,
    password,
    nickname,
    code,
  }: RegisterDto): Promise<SuccessDto> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: { email: true },
    });

    // 이미 이메일 가입 정보가 존재하는 경우
    if (user) {
      throw errors.FailedRegister('중복된 이메일이 존재합니다');
    }

    // 이메일 인증
    await this.verifyEmail({ email, code });

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // User 생성
    await this.prismaService.users.createMany({
      data: { email, nickname, password: hashedPassword },
    });
    return { success: true };
  }

  /**
   * Request Email
   */
  async requestEmail({ email }: RequestEmailDto): Promise<SuccessDto> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
      select: { email: true },
    });

    // 이미 이메일 가입 정보가 존재하는 경우
    if (user) {
      throw errors.FailedRegister('중복된 이메일이 존재합니다');
    }

    // 인증 코드 생성
    const code = this.createCode();

    // 만료 시간은 1시간
    const expiresAt = new Date();
    expiresAt.setUTCHours(expiresAt.getUTCHours() + 1);

    // DB 저장
    await this.prismaService.emailVerifies.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    // 이메일 전송
    await addEmailSQS(JSON.stringify({ email, code }));
    return { success: true };
  }

  /**
   * Verify Email
   */
  async verifyEmail({ email, code }: VerifyEmailDto): Promise<SuccessDto> {
    const baseTime = new Date();
    baseTime.setUTCHours(baseTime.getUTCHours() - 1);

    // DB 조회
    const isValid = await this.prismaService.emailVerifies.findFirst({
      where: { email, code },
    });

    // 이메일 인증이 유효하지 않다면
    if (!isValid || isValid.expiresAt.getTime() < baseTime.getTime()) {
      throw errors.FailedRegister();
    }
    return { success: true };
  }

  /* Create Code */
  private createCode(): string {
    let code = '';

    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  }

  /* 토큰 생성 */
  private createAccessToken(user: UserDto): string {
    return this.jwtService.sign(user);
  }

  /* RefreshToken 생성 */
  private async createRefreshToken(id: number): Promise<string> {
    // payload
    const payload = { id };

    // options (7일 만료로 설정)
    const options = {
      expiresIn: '7d',
    };

    // Refresh 토큰 발급
    const refreshToken = this.jwtService.sign(payload, options);

    // 토큰 업데이트
    await this.prismaService.users.updateMany({
      where: { id },
      data: { refreshToken },
    });
    return refreshToken;
  }

  /* Refresh Token 검증 */
  private validateRefreshToken(token: string): { id: number } {
    try {
      const payload = this.jwtService.verify(token);
      return { id: payload.id };
    } catch (e) {
      throw errors.InvalidAccessToken();
    }
  }
}
