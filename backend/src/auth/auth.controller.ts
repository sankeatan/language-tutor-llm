import { Controller, Post, Body, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
) {}

  @Post('register')
  async register(@Body() body: { email: string, password: string, username: string }) {
    const user = await this.authService.register(body.email, body.password, body.username);
    return { message: 'User registered successfully', user };
  }

  @Post('login')
  async login(@Body() body: { email: string, password: string }) {
    const { token, userId } = await this.authService.login(body.email, body.password);
    return { token, userId };  // Return JWT token and userId
  }

  @Get('verify-token')
  verifyToken(@Req() req: Request) {
    const token = req.cookies['token'];  // Get the token from cookies
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });  // Verify the token
      return { valid: true, decoded };  // Return decoded token if valid
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  
  @Post('logout')
  logout(@Res() res: Response) {
    // Clear the cookie
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
