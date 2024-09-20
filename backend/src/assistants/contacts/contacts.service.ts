import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatAssistant } from 'src/assistants/dto/schemas/chat-assistant.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ChatAssistant.name) private readonly agentModel: Model<ChatAssistant>,
  ) {}

  // Fetch all contacts (agents) for a user
  async getAllContactsForUser(userId: string): Promise<ChatAssistant[]> {
    return this.agentModel.find({ userId }).exec();  // Find all agents by userId
  }
}
