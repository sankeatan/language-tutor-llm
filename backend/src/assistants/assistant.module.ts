import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { ChatAssistant, ChatAssistantSchema } from '../assistants/schemas/chat-assistant.schema'
import { OpenAIService } from '../shared/services/openai.service';  // Import OpenAIService

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChatAssistant.name, schema: ChatAssistantSchema }]),
  ],
  controllers: [AssistantController],
  providers: [AssistantService, OpenAIService],
  exports: [AssistantService],
})
export class AssistantModule {}
