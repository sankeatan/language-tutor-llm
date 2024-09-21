export declare class CreateConversationDto {
    readonly userId: string;
    readonly messages: {
        role: string;
        content: string;
    }[];
    readonly assistant: string;
    readonly assistantName: string;
}
