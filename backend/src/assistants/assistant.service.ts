import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OpenAI } from 'openai'; // Import OpenAI client
import { ChatAssistant } from './schemas/chat-assistant.schema';
import { CreateChatAssistantDto } from './dto/create-chat-assistant.dto';
import { CreateConversationDto } from '../chat/dto/create-conversation.dto';
import { ChatService } from '../chat/chat.service';
import { JsonWebTokenError } from '@nestjs/jwt';

@Injectable()
export class AssistantService {
  private openai: OpenAI;

  constructor(
    @InjectModel(ChatAssistant.name) private chatAssistantModel: Model<ChatAssistant>,
    private readonly chatService: ChatService,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // Initialize OpenAI client
  }

  async generateChatAssistant(createChatAssistantDto: CreateChatAssistantDto) {
    const { personality, interests, userId, gender, age } = createChatAssistantDto;

    let name = 'Generating...';
    let background = 'Generating...';
    let assistantId = 'Generating...'

    const backgroundPrompt = `
      Please help complete the profile of a contemporary spanish language speaker.
      I would like you to generate a name, as well as history and background that are culturally appropriate for a spanish speaker.
      I am going to give you a personality trait and list of interests and a gender that you are going to incorporate into the history and background.
      If the value for any of these profile key's is "GPT Choice" then I'd like you to insert your own choice for that value.

      Profile
      Personality: ${personality}
      Interests: ${interests.join(', ')}
      Gender: ${gender}
      Age Range: ${age}

      When generating the name please take gender into account.

      When writing the history please include birth year, birth place, current country, relatives, notable current and past friends, 
      notable current and past jobs, and any other details that can help give the profile a detailed history. When generating the birth year 
      take the age of the user into account. Subtract it from the current year of 2024. Give the response only in spanish. 
      Do not limit the background location to Spain. Include other Spanish speaking countries, or even countries where Spanish isn't the main language
      but a very common second language.

      Respond with a in json using the following two keys in english
      name:
      background:
    `;

    const assistantResponse = await this.chatService.getGPT4Response(backgroundPrompt);
    console.log("Raw GPT-4 response: ", assistantResponse)

    try {
      // Find the indices where 'name:' and 'background:' start
    const nameIndex = assistantResponse.indexOf('"name":') + 7
    const backgroundIndex = assistantResponse.indexOf('"background":') + 15

    // Extract the name and background based on the indices
    name = assistantResponse.slice(nameIndex+2, backgroundIndex - 19).trim(); // Extract name, subtracting 'background:'
    background = assistantResponse.slice(backgroundIndex, assistantResponse.length-2).trim(); // Extract background from the start of 'background:'

    console.log(`Extracted Name: ${name}`);
    console.log(`Extracted Background: ${background}`);
  } catch (error) {
    console.error('Failed to extract name and background from GPT-4 response:', error);
  }

    const instructions = `
    You are a language partner for an end user that knows English but wants to learn Spanish.

    The following is a profile of your personality, interests, as well as background history. 
    Personality: ${personality}
    Interests: ${interests.join(', ')}
    Background: ${background}.
    
    Use this profile to provide interesting and engaging conversations to the end user in Spanish.`

    // Create assistant object locally
    const chatAssistant = new this.chatAssistantModel({
      assistantId: assistantId,
      name: name,
      personality,
      interests,
      userId,
      instructions: instructions.trim(),
      background: background
    });

    const openaiResponse = await this.openai.beta.assistants.create({
    instructions: chatAssistant.instructions,
    name: chatAssistant.name,
    model: 'gpt-4o',
    });

    chatAssistant.assistantId = openaiResponse.id

    await chatAssistant.save();
    console.log(chatAssistant)
  }

  // Method to fetch all assistants for a user
  async getAllAssistantsForUser(userId: string): Promise<ChatAssistant[]> {
    return this.chatAssistantModel.find({ userId }).exec();  // Find all assistants with the userId
  }
}
