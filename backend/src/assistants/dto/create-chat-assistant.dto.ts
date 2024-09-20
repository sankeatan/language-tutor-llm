export class CreateChatAssistantDto {
    readonly name: string;
    readonly personality: string;
    readonly background: string;
    readonly userId: string;
    readonly interests: string[];
  }
  