import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatService } from '../chat/chat.service'
import { CreateConversationDto } from '../chat/dto/create-conversation.dto';
import { Model } from 'mongoose';
import { ChatAssistant } from 'src/assistants/schemas/chat-assistant.schema';
import { extractNameAndBackground } from '../common/utils'

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

    // Create a conversation for this assistant
    const createConversationDto: CreateConversationDto = {
      userId: userId,
      messages: [{role: 'user', content: prompt,}],
      assistant: chatAssistant._id.toString(),
      assistantName: 'temp'
    };

    const conversation = await this.chatService.createConversation(createConversationDto);
    const conversationId = conversation._id;  // Get the conversation ID

    // Assuming the response has name and background, split it accordingly
    const response = conversation.messages[1].content;
    const parsedResponse = JSON.parse(response);
    // Extract name and background from the parsed object
    const name = parsedResponse.name || 'Unknown Name';
    const background = parsedResponse.background || 'Unknown Background';

    chatAssistant.name = name;
    chatAssistant.background = background;
    await chatAssistant.save();

    return {
      conversationId, 
      name,
      background,
    };
  }

  // Method to fetch all assistants for a user
  async getAllAssistantsForUser(userId: string): Promise<ChatAssistant[]> {
    return this.chatAssistantModel.find({ userId }).exec();  // Find all assistants with the userId
  }
}
