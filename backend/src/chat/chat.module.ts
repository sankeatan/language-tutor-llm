import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Thread, ThreadSchema } from './schemas/thread.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { OpenAIService } from '../shared/services/openai.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenAIService],
  exports: [ChatService],  
})
export class ChatModule {}
