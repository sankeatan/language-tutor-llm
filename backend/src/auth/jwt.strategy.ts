import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your_jwt_secret',  // Use the same secret as in AuthModule
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new Error('Invalid token');
    }
    return { userId: user._id, email: user.email };  // Attach user data to request
  }
}
