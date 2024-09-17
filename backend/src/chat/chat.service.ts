import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Conversation } from './schemas/conversation.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { OpenAI } from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {
      this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,  // Store API Key in .env file
    });
  }

  // Create a new conversation
  async createConversation(dto: CreateConversationDto): Promise<Conversation> {
    const newConversation = new this.conversationModel({
      userId: dto.userId,
      messages: dto.messages,
    });

    //Create convo
    const savedConversation = await newConversation.save();

    // Get the MongoDB-generated conversationId
    const conversationId = savedConversation._id;

    //User's initial message
    const userMessage = savedConversation.messages[0].content;

    // Send the user's message to ChatGPT and get the response, pass conversationId
    const gptResponse = await this.getGPT4Response(conversationId.toString(), userMessage);

    // Update the conversation with GPT-4's response
    savedConversation.messages.push({ role: 'assistant', content: gptResponse });

    await savedConversation.save();  // Save the updated conversation with GPT response

    return savedConversation; // savedConversation will now have a generated _id field
  }

  // Get GPT-4 response and update the conversation
  async getGPT4Response(conversationId: string, message: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      });

      const reply = response.choices[0].message?.content || 'No response from GPT-4';

      // Update conversation with the new message and GPT response
      await this.updateConversation({
        conversationId: conversationId,
        messages: [{ role: 'user', content: message }, { role: 'assistant', content: reply }],
      });

      return reply;
    } catch (error) {
      console.error('Error communicating with OpenAI API', error);
      throw new Error('Failed to get response from GPT-4');
    }
  }

  // Update an existing conversation
  async updateConversation(dto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationModel.findById(dto.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
  
    conversation.messages.push(...dto.messages);
    await conversation.save();
    return conversation;
  }

  // Delete a conversation
  async deleteConversation(conversationId: string): Promise<Conversation> {
    return this.conversationModel.findByIdAndDelete(conversationId);
  }

  // Get all conversations for a user
  async getAllConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ userId }).exec();
  }
}
