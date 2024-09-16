export class UpdateConversationDto {
  readonly conversationId: string;
  readonly messages: {
    role: string;
    content: string;
  }[];
}