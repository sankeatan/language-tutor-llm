import { AssistantService } from './assistant.service';
import { CreateChatAssistantDto } from './dto/create-chat-assistant.dto';
export declare class AssistantController {
    private readonly assistantService;
    constructor(assistantService: AssistantService);
    getAllAssistants(userId: string): Promise<import("./schemas/chat-assistant.schema").ChatAssistant[]>;
    generateAssistant(createChatAssistantDto: CreateChatAssistantDto): Promise<void>;
}
