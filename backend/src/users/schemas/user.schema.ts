import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  _id: Types.ObjectId; // MongoDB's ObjectId will act as userId

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string; //Hashed

  @Prop({ type: Array, default: [] })
  conversationHistory: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
