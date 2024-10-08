import { AssistantService } from './assistant.service';
import { ChatAssistant } from './schemas/chat-assistant.schema';
export declare class AssistantController {
    private readonly assistantService;
    constructor(assistantService: AssistantService);
    createAssistant(userId: string, personalityTraits: string[], interests: string[], gender: string, age: number, language: string): Promise<ChatAssistant>;
    getAssistant(assistantId: string): Promise<ChatAssistant>;
    listAssistants(userId: string): Promise<ChatAssistant[]>;
    updateAssistant(assistantId: string, personalityTraits: string[], interests: string[], gender: string, age: number, language: string): Promise<ChatAssistant>;
    deleteAssistant(assistantId: string): Promise<{
        message: string;
    }>;
}
