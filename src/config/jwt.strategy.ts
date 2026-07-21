import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'JWT_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.id,
      email: payload.email,
      roleId: payload.roleId,
      // role: payload.role,
    };
  }
}
