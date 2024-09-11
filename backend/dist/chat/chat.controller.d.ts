import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getChatResponse(message: string): Promise<{
        response: string;
    }>;
}
