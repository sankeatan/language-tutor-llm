export class CreateChatAssistantDto {
  readonly personality: string;
  readonly interests: string[];
  readonly gender?: string;
  readonly age?: number;
  readonly userId: string;
  readonly systemInstructions: string;
  readonly tools?: string[]; // Array of tools (e.g., 'code_interpreter')
  readonly temperature?: number; // Optional temperature setting
  readonly model?: string; // Optional model (defaults to 'gpt-4o')
  readonly topP?: number; // Optional topP
}