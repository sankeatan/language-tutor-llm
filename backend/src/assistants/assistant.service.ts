import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatAssistant, ChatAssistantDocument } from './schemas/chat-assistant.schema';
import { OpenAIService } from 'src/shared/services/openai.service';
import * as fs from 'fs'


@Injectable()
export class AssistantService {
  private readonly logger = new Logger(AssistantService.name);

  constructor(@InjectModel(ChatAssistant.name)
    private assistantModel: Model<ChatAssistantDocument>,
    private readonly openAIService: OpenAIService) {}

  // Create a new chatbot assistant
  async createAssistant(userId: string, assistantData: Partial<ChatAssistant>): Promise<ChatAssistant> {
    this.logger.log(`Creating assistant for user: ${userId}`);


    // Auto-generate background history and relationships based on predefined logic
    const name = await this.generateName(
      assistantData.personalityTraits, 
      assistantData.interests, 
      assistantData.gender, 
      assistantData.age, 
      assistantData.language
    )
    const backgroundHistory = await this.generateBackground(
      assistantData.personalityTraits, 
      assistantData.interests, 
      assistantData.gender, 
      assistantData.age, 
      assistantData.language,
      name.toString());
    const relationships = await this.generateRelationships(
      assistantData.personalityTraits, 
      assistantData.interests, 
      assistantData.gender, 
      assistantData.age, 
      assistantData.language, 
      backgroundHistory.toString());
    const weeklySchedule = await this.generateWeeklySchedule(
      assistantData.personalityTraits, 
      assistantData.interests, 
      assistantData.gender, 
      assistantData.age, 
      assistantData.language, 
      backgroundHistory.toString(), 
      relationships.toString());

    const instructions = `You are a conversational language partner for an English speaker that is learning ${assistantData.language}. You are going to
    be given a background, relationships, and a weekly schedule in your Vector Database. 
    
    You are being sent a text message from your language partner. Please use the background, relationships, weekly schedule and conversation context
    to decide how best to reply in ${assistantData.language}`

    const backgroundFilePath = './backgroundHistory.txt';
    const relationshipsFilePath = './relationships.json';
    const scheduleFilePath = './weeklySchedule.json';

    fs.writeFileSync(backgroundFilePath, backgroundHistory);
    fs.writeFileSync(relationshipsFilePath, JSON.stringify(relationships));
    fs.writeFileSync(scheduleFilePath, JSON.stringify(weeklySchedule));

    const backgroundFile = await this.openAIService.uploadAssistantFile(backgroundFilePath)
    const relationshipsFile = await this.openAIService.uploadAssistantFile(relationshipsFilePath);
    const scheduleFile = await this.openAIService.uploadAssistantFile(scheduleFilePath);

    const vectorStore = await this.openAIService.createVectorStore([backgroundFile.id, relationshipsFile.id, scheduleFile.id])

    const thread = await this.openAIService.createThread({vector_store_ids: [vectorStore.id]})

    const newAssistant = new this.assistantModel({
      ...assistantData,
      name,
      threadId: thread.id,
      vectorId: vectorStore.id,
      userId,
      backgroundHistory,
      relationships,
      weeklySchedule,
    });

    return newAssistant.save();
  }

  // Get an assistant
  async getAssistantById(assistantId: string): Promise<ChatAssistant> {
    this.logger.log(`Fetching assistant by id: ${assistantId}`);
    return this.assistantModel.findOne({assistantId}).exec();
  }

  // List all assistants for a specific userId
  async listAssistantsByUser(userId: string): Promise<ChatAssistant[]> {
    this.logger.log(`Listing all assistants for user: ${userId}`);
    return this.assistantModel.find({ userId }).exec();
  }

  // Update an assistant's traits (e.g., interests, personality) before creation
  async updateAssistant(assistantId: string, updateData: Partial<ChatAssistant>): Promise<ChatAssistant> {
    this.logger.log(`Updating assistant with id: ${assistantId}`);
    return this.assistantModel.findOneAndUpdate({ assistantId }, updateData, { new: true }).exec();
  }

  // Delete an assistant
  async deleteAssistant(assistantId: string): Promise<void> {
    this.logger.log(`Deleting assistant with id: ${assistantId}`);
    await this.assistantModel.deleteOne({ assistantId }).exec();
  }

  async generateName(
    personality: string[],
    interests: string[],
    gender: string,
    age: number,
    language: string
  ): Promise<string> {
    const prompt = `
      Generate an appropriate name for a person living in a culture dominated by ${language}:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}`

  return await this.openAIService.generateCompletion(prompt);
  }

  async generateBackground(
    personality: string[],
    interests: string[],
    gender: string,
    age: number,
    language: string,
    name: string
  ): Promise<string> {
    const prompt = `
      Write a short autobiographical background story written in ${language} for a person named ${name} with the following attributes:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}
      
      The story should be written in the first person, in ${language}, and reflect the person's upbringing, key life experiences, and values. 
      It should incorporate the person's cultural background and be consistent with the customs of the ${language} culture.`;

    return await this.openAIService.generateCompletion(prompt);
  }
  

  async generateRelationships(
    personality: string[],
    interests: string[],
    gender: string,
    age: number,
    language: string,
    background: string,
  ): Promise<string> {
    const prompt = `
      Analyze this autobiographical background for a character with the following attributes:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests} 
      - Background: "${background}"

      Now, write a short list in ${language} of important relationships based on that background. If any specific relationships are mentioned 
      please include them in the list, if any details about that relationship description is missing please generate it. If it is a group of people, such as 
      a group of friends or coworkers, please generate individuals within that group and a description for them as well.

      For each relationship, describe:
      1. Their name
      2. Their relationship with the character
      3. The impact their relationship has had on the character's life
      
      Return it is a json object with the first value being the relation's name like this:
      
      Relationships: {
        "Axel Cubillo": {
            "Relation": "Padre",
            "Influence": "Ha esta por su lado hasta siempre"
            },
        "Isabela Frances": {
            "Relation": "Amgia",
            "Influence": "Una amiga de escuela"
            },    
        }`;
  
    return await this.openAIService.generateCompletion(prompt);
  }
  
  async generateWeeklySchedule(
    personality: string[],
    interests: string[],
    gender: string,
    age: number,
    language: string,
    backgroundHistory: string,
    relationips: string,
  ): Promise<string> {
    const prompt = `
      Write a short weekly schedule for a chatbot with the following attributes, written in ${language}:
      - Gender: ${gender}
      - Age: ${age}
      - Personality traits: ${personality}
      - Interests: ${interests}
      - Background History: ${backgroundHistory}
      - Relationships: ${relationips}
      - Target language: ${language}

      
      The schedule should include daily activities that reflect the chatbot's personality, hobbies, and interests, background history, and relationships.
      It should also include cultural practices and routines specific to the ${language} culture, such as social gatherings, rest times (like siesta), and other customs.

      Respond with a json object that has each day of the week (Sunday - Saturday) listed as the initial value, like this:

      "Schedule": {
        "Sunday": {
          "8:00": "Desayunar con mi familia",
          "9:00": "Sale la casa por iglesia",
          }
        }
    `;
  
    return await this.openAIService.generateCompletion(prompt);
  }
  
}