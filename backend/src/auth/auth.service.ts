import { Injectable } from '@nestjs/common';
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

    const payload = { userId: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { token, userId: user._id };  // Return JWT and userId
  }

  // Validate a user based on JWT token
  async validateUser(userId: string) {
    return this.userModel.findById(userId);
  }
}
