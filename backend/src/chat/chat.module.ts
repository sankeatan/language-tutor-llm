import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],  // Register ChatController
  providers: [ChatService],       // Register ChatService
  exports: [ChatService],         // Optionally export ChatService for use in other modules
})
export class ChatModule {}
