import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
