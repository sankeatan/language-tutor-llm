export class CreateConversationDto {
    readonly userId: string;
    readonly messages: { role: string, content: string }[];
  }
  