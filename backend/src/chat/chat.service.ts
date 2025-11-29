import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread, ThreadDocument } from './schemas/thread.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { OpenAIService } from '../shared/services/openai.service';  // Use the OpenAI Service we already created

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Thread.name) private threadModel: Model<ThreadDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly openAIService: OpenAIService,
  ) {}

  // Create a new thread
  async createThread(thread: Thread): Promise<Thread> {
    this.logger.log(`Creating thread for user: ${thread.userId}`);
    const newThread = new this.threadModel({
      userId: thread.userId, 
      metadata: thread.metadata
    });
    return newThread.save();
  }

   // Add a message to the thread
   async addMessage(message: Message): Promise<Message> {
    this.logger.log(`Adding message to thread ${message.threadId}`);

    const newMessage = new this.messageModel({
      threadId: message.threadId,
      role: message.role === "user" ? "user" : "assistant",
      content: message.content,
      timestamp: message.timestamp || new Date()
    });

    return newMessage.save();
  }

  // Handle incoming user message and return assistant response
  async handleUserMessage(threadId: string, assistantId: string, content: string): Promise<Message> {

    // Add user message to the thread
    await this.addMessage({threadId, role:'user', content, timestamp: new Date});

    // Get assistant response via OpenAI Service
    await this.openAIService.appendMessageToThread(threadId, {role: 'user', content});
    const assistantResponse = await this.openAIService.runAssistantOnThread(threadId, assistantId);

    // Add assistant message to the thread
    return this.addMessage({threadId, role: 'assistant', content: assistantResponse.content, timestamp: new Date});
  }


  // Retrieve all messages in a thread
  async getMessages(threadId: string): Promise<Message[]> {
    this.logger.log(`Fetching messages for thread ${threadId}`);
    return this.messageModel.find({ threadId }).exec();
  }

  // Delete a thread and its associated messages
  async deleteThread(threadId: string): Promise<void> {
    await this.threadModel.findByIdAndDelete(threadId).exec();
    await this.messageModel.deleteMany({ threadId }).exec();
  }

  // Delete a specific message from a thread
  async deleteMessage(threadId: string, messageId: string): Promise<void> {
    await this.messageModel.findOneAndDelete({ _id: messageId, threadId }).exec();
  }
}
