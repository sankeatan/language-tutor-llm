import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatAssistantDocument = ChatAssistant & Document;

@Schema()
export class ChatAssistant {
  @Prop({ required: true })
  userId: string;  // The user to whom this assistant belongs

  @Prop({ required: true })
  threadId: string;  // The thread to which this assistant belongs

  @Prop({ required: true })
  vectorId: string;  // The vector store to which this assistant stores information

  @Prop({ required: true })
  name: string;  // The chatbot's name

  @Prop({ required: true })
  gender: string;  // User-defined gender (e.g., male, female, non-binary)

  @Prop({ required: true })
  age: number;  // User-defined age

  @Prop({ required: true })
  language: string;  // The language this assistant is using

  @Prop({ required: true })
  interests: string[];  // Array of user-defined interests (e.g., sports, music)

  @Prop({ required: true })
  personalityTraits: string[];  // Array of personality traits (e.g., friendly, introverted)

  @Prop()
  backgroundHistory: string;  // Auto-generated background history for the chatbot

  @Prop()
  relationships: string[];  // Auto-generated relationships (e.g., mentor, friend)
}

export const ChatAssistantSchema = SchemaFactory.createForClass(ChatAssistant);
