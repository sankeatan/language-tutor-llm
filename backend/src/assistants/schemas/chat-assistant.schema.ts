import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatAssistant extends Document {
  @Prop({ required: true })
  assistantId: string; // OpenAI Assistant ID
  
  @Prop({ required: true })
  name: string; // Assistant's name

  @Prop({ required: true })
  userId: string; // User associated with this assistant

  @Prop({ required: false })
  instructions: string; // System instructions for assistant (behavior, style)
  
  @Prop({ required: true })
  personality: string; // Description of personality
  
  @Prop({ required: true })
  interests: string[]; // Assistant interests

  @Prop({ required: true })
  background: string; // Background details for assistant
}

export const ChatAssistantSchema = SchemaFactory.createForClass(ChatAssistant);