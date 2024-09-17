// ChatUI.tsx

import { useState, useRef, useEffect } from 'react';
import { ConversationList } from './conversation-list';
import { MessageList } from './message-list';
import { InputArea } from './input-area';
import { NewConversationScreen } from './new-conversation-screen';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

type Conversation = {
  id: number;
  title: string;
  messages: Message[];
  lastUsed: Date;
};

export function ChatUi() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, title: 'Basic Greetings', messages: [
      { role: 'ai', content: '¡Hola! ¿Cómo estás? (Hello! How are you?)' },
      { role: 'user', content: 'Estoy bien, gracias. ¿Y tú? (I\'m fine, thank you. And you?)' },
      { role: 'ai', content: 'Muy bien, gracias. Let\'s practice some basic Spanish greetings!' },
    ], lastUsed: new Date(2023, 5, 15) },
    { id: 2, title: 'Numbers 1-10', messages: [
      { role: 'ai', content: 'Let\'s learn to count from 1 to 10 in Spanish!' },
      { role: 'user', content: 'Great! How do I say "one" in Spanish?' },
      { role: 'ai', content: '"One" in Spanish is "uno". Can you try counting from 1 to 3?' },
    ], lastUsed: new Date(2023, 5, 14) },
  ]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [newConversationMethod, setNewConversationMethod] = useState<'voice' | 'media' | 'text' | null>(null);

  const handleSendMessage = async () => {
    // Logic to send message to backend
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = (id: number) => {
    setConversations(conversations.filter(conv => conv.id !== id));
    if (currentConversation && currentConversation.id === id) {
      setCurrentConversation(null);
    }
  };

  const startNewConversation = (method: 'voice' | 'media' | 'text') => {
    setNewConversationMethod(method);
    const newConversation: Conversation = {
      id: conversations.length + 1,
      title: `New Conversation ${conversations.length + 1}`,
      messages: [],
      lastUsed: new Date(),
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversation(newConversation);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {currentConversation ? (
        <>
          <MessageList messages={currentConversation.messages} />
          <InputArea
            input={input}
            setInput={setInput}
            onSendMessage={handleSendMessage}
            handleMicrophoneStart={() => {}}
            handleMicrophoneEnd={() => {}}
            handlePaperclipClick={() => {}}
          />
        </>
      ) : (
        <NewConversationScreen startNewConversation={startNewConversation} />
      )}
    </div>
  );
}
