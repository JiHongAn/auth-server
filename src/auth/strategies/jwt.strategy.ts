import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { errors } from '../../libs/errors';
import { UserDto } from '../../libs/dtos/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      ignoreExpiration: false,
    });
  }

  validate(payload: any): UserDto {
    if (!payload.id || !payload.nickname) {
      throw errors.InvalidAccessToken();
    }
    return {
      id: payload.id,
      nickname: payload.nickname,
      profileUrl: payload?.profileUrl,
    };
  }
}
