import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request & { user?: any}>();
    const token = request.cookies['token'];  // Get the token from cookies

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the token
      const payload = this.jwtService.verify(token);
      request.user = payload;  // Attach the user to the request object
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
