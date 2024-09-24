import { Controller, Post, UseGuards, Req, Body, Param, Delete, Get, Put, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard('jwt'))  // Protect this route
  // Create a new conversation
  @Post('create')
  async createConversation(@Body() createConversationDto: CreateConversationDto) {
    const conversation = await this.chatService.createConversation(createConversationDto);
    return { conversationId: conversation._id, conversation };  // Return conversation with MongoDB _id
  }

  @UseGuards(AuthGuard('jwt'))
  //Update a conversation from conversationId
  @Get(':conversationId')
  async getAConversationById(@Param('conversationId') conversationId: string) {
    return this.chatService.getAConversationById(conversationId);
  }
  
  @UseGuards(AuthGuard('jwt'))
  //Update conversation
  @Put(':conversationId')
  async updateConversation(@Body() updateConversationDto: UpdateConversationDto) {
    return this.chatService.updateConversation(updateConversationDto);
  }

  @UseGuards(AuthGuard('jwt'))
  // Get GPT-4 response and update the conversation
  @Post(':id')
  async getChatResponse(
    @Param('id') conversationId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.getGPT4Response(conversationId, message);
  }

  @UseGuards(AuthGuard('jwt'))
  // Delete a conversation
  @Delete(':id')
  async deleteConversation(@Param('id') conversationId: string) {
    return this.chatService.deleteConversation(conversationId);
  }

  @UseGuards(AuthGuard('jwt'))
  // Get all conversations for a user
  @Get('user/:userId')
  async getAllConversations(@Param('userId') userId: string) {
    return this.chatService.getAllConversations(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  // Get a conversation
  @Get('assistant/:assistantId')
  async getAConversation(
    @Param('assistantId') assistantId: string
  ) {
    return this.chatService.getAConversationByAssistantId(assistantId);
  }
}
