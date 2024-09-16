import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ type: [Message], default: [] })
  messages: Message[];
}

// Create the schema factories for Mongoose
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
export const MessageSchema = SchemaFactory.createForClass(Message);
