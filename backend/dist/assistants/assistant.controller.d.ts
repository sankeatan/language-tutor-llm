import { AssistantService } from './assistant.service';
export declare class AssistantController {
    private readonly assistantService;
    constructor(assistantService: AssistantService);
    getAllAssistants(userId: string): Promise<import("./dto/schemas/chat-assistant.schema").ChatAssistant[]>;
    generateassistant(createChatAssistantDto: {
        personality: string;
        interests: string[];
        userId: string;
    }): Promise<{
        conversationId: unknown;
        name: any;
        background: any;
    }>;
}
