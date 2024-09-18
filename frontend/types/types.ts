export type Message = {
    role: 'user' | 'ai';
    content: string;
  };
  
  export type Conversation = {
    id: string;  // Change number to string to match the MongoDB ID type
    title: string;
    messages: Message[];
    lastUsed: Date;
  };