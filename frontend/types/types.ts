export type Message = {
    role: 'user' | 'ai';
    content: string;
  };
  
  export type Conversation = {
    id: string; 
    messages: Message[];
    lastUsed: Date;
    assistant: string;
    assistantName: string;
  };

  export type ChatAssistant = {
    assistantId: string;
    userId: string;
    name: string;
    personality: string;
    interests: string;
    background: string;
    instructions: string;
  };