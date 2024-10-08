import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  // Register a new user
  async register(email: string, password: string, username: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, password: hashedPassword, username });
    return user.save();
  }

  // Login a user and return JWT token
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Payload for access token (contains user-specific information)
    const accessTokenPayload = { userId: user._id, email: user.email };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m'
    });

    const refreshTokenPayload = { userId: user._id };

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',  // Refresh token expires in 7 days
      });

    return { accessToken, refreshToken, userId: user._id };  // Return JWT and userId
  }

  // Validate a user based on JWT token
  async validateUser(userId: string) {
    return this.userModel.findById(userId);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
      console.log('Verifying refresh token...')
      console.log('Refresh token payload:', payload); 

      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        console.log('User not found during token refresh');
        throw new UnauthorizedException('User not found');
      }

      // Generate new access and refresh tokens
      const newAccessToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_SECRET, expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign({ sub: user.id }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });

      console.log('New tokens generated:', { newAccessToken, newRefreshToken });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
        console.error('Error during token refresh:', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
