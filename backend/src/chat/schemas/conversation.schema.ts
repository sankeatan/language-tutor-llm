import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ChatAssistant, ChatAssistantSchema } from 'src/assistants/schemas/chat-assistant.schema';

// Define the message sub-schema
@Schema()
export class Message {
  @Prop({ required: true })
  role: string;  // 'user' or 'assistant'

  @Prop({ required: true })
  content: string;
}

// Define the conversation schema
@Schema({ timestamps: true }) // Automatically manages createdAt and updatedAt timestamps
export class Conversation extends Document {
  @Prop({ required: true })
  userId: string; // The ID of the user to whom this conversation belongs

  @Prop({ required: true }) // Associate conversation with an assistant
  assistant: string

  @Prop({ required: true }) // Associate conversation with an assistant
  assistantName: string

  @Prop({ type: [Message], default: [] })
  messages: Message[]; //messages

  @Prop({ default: Date.now })
  lastUsed: Date; // Last time this conversation was used
  
}

// Create the schema factories for Mongoose
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
export const MessageSchema = SchemaFactory.createForClass(Message);
