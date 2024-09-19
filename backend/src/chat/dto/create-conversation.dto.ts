export class CreateConversationDto {
    readonly userId: string;
    readonly title: string;
    readonly messages: { role: string, content: string }[];
  }
  