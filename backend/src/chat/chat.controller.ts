import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async getChatResponse(@Body('message') message: string) {
    const response = await this.chatService.getGPT4Response(message);
    return { response };
  }
}
