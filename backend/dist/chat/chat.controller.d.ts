import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    createConversation(createConversationDto: CreateConversationDto): Promise<{
        conversationId: unknown;
        conversation: import("./schemas/conversation.schema").Conversation;
    }>;
    getAConversationById(conversationId: string): Promise<import("./schemas/conversation.schema").Conversation>;
    updateConversation(updateConversationDto: UpdateConversationDto): Promise<import("./schemas/conversation.schema").Conversation>;
    getChatResponse(conversationId: string, message: string): Promise<string>;
    deleteConversation(conversationId: string): Promise<import("./schemas/conversation.schema").Conversation>;
    getAllConversations(userId: string): Promise<import("./schemas/conversation.schema").Conversation[]>;
    getAConversation(assistantId: string): Promise<import("./schemas/conversation.schema").Conversation>;
}
