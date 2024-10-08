import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { OpenAIService } from 'src/shared/services/openai.service';
import { Thread } from './schemas/thread.schema';
import { Message } from './schemas/message.schema';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly openAIService: OpenAIService) {}

  // Start a new chat thread
  @Post('start')
  async startThread(
    @Body('userId') userId: string,
    @Body('metadata') metadata: any,
  ): Promise<Thread> {
    const thread: Thread = { userId, metadata, createdAt: new Date() };
    return this.chatService.createThread(thread);
  }

  // Send a message in an existing thread
  @Post(':threadId/message')
  async sendMessage(
    @Param('threadId') threadId: string,
    @Body('assistantId') assistantId: string,
    @Body('content') content: string,
  ): Promise<Message> {
    return this.chatService.handleUserMessage(threadId, assistantId, content);
  }

  // Retrieve all messages in a thread
  @Get(':threadId/messages')
  async getMessages(@Param('threadId') threadId: string): Promise<Message[]> {
    return this.chatService.getMessages(threadId);
  }

  // Retrieve the latest message in a thread
  @Get(':threadId/latest')
  async getLatestMessage(@Param('threadId') threadId: string): Promise<Message> {
    return this.openAIService.getLatestMessage(threadId);
  }

  // Delete a thread and all its associated messages
  @Delete(':threadId')
  async deleteThread(@Param('threadId') threadId: string): Promise<{ message: string }> {
    await this.chatService.deleteThread(threadId);
    return { message: `Thread ${threadId} deleted successfully` };
  }

  // Delete a specific message in a thread
  @Delete(':threadId/message/:messageId')
  async deleteMessage(
    @Param('threadId') threadId: string,
    @Param('messageId') messageId: string,
  ): Promise<{ message: string }> {
    await this.chatService.deleteMessage(threadId, messageId);
    return { message: `Message ${messageId} from thread ${threadId} deleted successfully` };
  }

}
