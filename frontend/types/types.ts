export type Message = {
    role: 'user' | 'ai';
    content: string;
  };
  
  export type Conversation = {
    id: string; 
    title: string;
    messages: Message[];
    lastUsed: Date;
    assistant: string;
    assistantName: string;
  };

  export type ChatAssistant = {
    id: string;
    userId: string;
    name: string;
    personality: string;
    interests: string;
    background: string;
  };