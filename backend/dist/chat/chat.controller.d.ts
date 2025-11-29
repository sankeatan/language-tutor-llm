import { ChatService } from './chat.service';
import { OpenAIService } from 'src/shared/services/openai.service';
import { Thread } from './schemas/thread.schema';
import { Message } from './schemas/message.schema';
export declare class ChatController {
    private readonly chatService;
    private readonly openAIService;
    constructor(chatService: ChatService, openAIService: OpenAIService);
    startThread(userId: string, metadata: any): Promise<Thread>;
    sendMessage(threadId: string, assistantId: string, content: string): Promise<Message>;
    getMessages(threadId: string): Promise<Message[]>;
    getLatestMessage(threadId: string): Promise<Message>;
    deleteThread(threadId: string): Promise<{
        message: string;
    }>;
    deleteMessage(threadId: string, messageId: string): Promise<{
        message: string;
    }>;
}
