import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatService } from '../chat/chat.service'
import { CreateConversationDto } from '../chat/dto/create-conversation.dto';
import { Model } from 'mongoose';
import { ChatAssistant } from 'src/assistants/schemas/chat-assistant.schema';

@Injectable()
export class AssistantService {
  constructor(
    private readonly chatService: ChatService, 
    @InjectModel(ChatAssistant.name) private readonly chatAssistantModel: Model<ChatAssistant>,
  ) {}

  async generateChatAssistant(createChatAssistantDto: { personality: string; interests: string[]; userId: string; }) {
    const { personality, interests, userId } = createChatAssistantDto;

    const chatAssistant = new this.chatAssistantModel({
      personality,
      interests,
      userId,
      name: 'temp',
      background: 'temp',
    })

    await chatAssistant.save();

    const prompt = `
      Your role is a conversational Spanish language partner.
      You have the following traits:
      Personality: ${personality}
      Interests: ${interests.join(', ')}

      With only two things, a culturally appropriate name for a Spanish language partner and a culturally appropriate background 
      that includes birth year, birth place, current country, relatives, current and past friends, current and past jobs, and 
      any other details that can help give the assistant a history. Tie in the traits that have been listed to the background as well.

      Respond with a json using the following two keys
      name:
      background:
    `;

    const assistantResponse = await this.chatService.getGPT4Response(prompt);

    let name = 'Unknown Name';
    let background = 'Unknown Background';

    try {
      const parsedResponse = JSON.parse(assistantResponse);

      name = parsedResponse.name || name;
      background = parsedResponse.background || background;
    } catch (error) {
      console.error('Failed to parse GPT-4 response:', error);
    }

    chatAssistant.name = name;
    chatAssistant.background = background;
    await chatAssistant.save();
  }

  // Method to fetch all assistants for a user
  async getAllAssistantsForUser(userId: string): Promise<ChatAssistant[]> {
    return this.chatAssistantModel.find({ userId }).exec();  // Find all assistants with the userId
  }
}
