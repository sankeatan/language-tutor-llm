import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ThreadDocument = Thread & Document;

@Schema()
export class Thread {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  metadata: {
    personality: string;
    language: string;
  };

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
