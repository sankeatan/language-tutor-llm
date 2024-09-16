import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateConversationDto } from '../chat/dto/update-conversation.dto';

@Controller('users')  // Base route for all user-related endpoints (e.g., /users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return { userId: user._id, user };
  }

  // Get a user by ID (e.g., fetching user profile or conversation history)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  // Update a user's conversation history (e.g., append a new conversation)
  @Patch(':id/conversation')
  async updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return await this.usersService.updateConversation(id, updateConversationDto);
  }
}
