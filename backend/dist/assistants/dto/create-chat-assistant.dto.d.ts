export declare class CreateChatAssistantDto {
    readonly personality: string;
    readonly interests: string[];
    readonly gender?: string;
    readonly age?: number;
    readonly userId: string;
    readonly systemInstructions: string;
    readonly tools?: string[];
    readonly temperature?: number;
    readonly model?: string;
    readonly topP?: number;
}
