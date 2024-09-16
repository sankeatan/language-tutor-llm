import { Controller, Post, Body, Param, Delete, Get, Put } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create a new conversation
  @Post('create')
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    const conversation = await this.chatService.createConversation(createConversationDto);
    return { conversationId: conversation._id, conversation };  // Return conversation with MongoDB _id

  }
  
  //Update conversation
  @Put(':conversationId')
  async updateConversation(
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.chatService.updateConversation(updateConversationDto);
  }

  // Get GPT-4 response and update the conversation
  @Post(':id')
  async getChatResponse(
    @Param('id') conversationId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.getGPT4Response(conversationId, message);
  }

  // Delete a conversation
  @Delete(':id')
  async deleteConversation(@Param('id') conversationId: string) {
    return this.chatService.deleteConversation(conversationId);
  }

  // Get all conversations for a user
  @Get('user/:userId')
  async getAllConversations(@Param('userId') userId: string) {
    return this.chatService.getAllConversations(userId);
  }
}
