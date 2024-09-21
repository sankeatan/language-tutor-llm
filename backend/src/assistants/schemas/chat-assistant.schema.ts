import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ChatAssistant {
    @Prop({ required: true })
    name: string; // Agent's name
  
    @Prop({ required: true })
    personality: string; // Description of personality

    @Prop({ required: true })
    userId: string;
  
    @Prop({ required: true })
    interests: string[]; // Agent interests
  
    @Prop({ required: false })
    instructions: string; // Specific instructions for agent (style, preferences)

    @Prop({ required: true })
    background: string;
  }
  export const ChatAssistantSchema = SchemaFactory.createForClass(ChatAssistant);