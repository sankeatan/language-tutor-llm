import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssistantService } from './assistant.service';
import { AssistantController } from './assistant.controller';
import { ChatService } from '../chat/chat.service'; 
import { Conversation, ConversationSchema } from '../chat/schemas/conversation.schema';
import { ChatAssistant, ChatAssistantSchema } from 'src/assistants/schemas/chat-assistant.schema';
import { ContactController } from './contacts/contacts.controller';
import { ContactService } from './contacts/contacts.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ChatAssistant.name, schema: ChatAssistantSchema }]),
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }])
      ],
  controllers: [AssistantController, ContactController],
  providers: [AssistantService, ChatService, ContactService], 
})
export class AssistantModule {}
