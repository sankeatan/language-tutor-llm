import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const { username, email } = user
    const newUser = new this.userModel({ username, email });
    return newUser.save();
  }

  async findUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  async updateConversation(userId: string, conversation: UpdateConversationDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, {
      $push: { conversationHistory: conversation },
    }).exec();
  }
}
