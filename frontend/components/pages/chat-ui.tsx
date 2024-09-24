'use client'

import { useState } from 'react';
import { MessageList } from '../chat/message-list';
import { InputArea } from '../chat/input-area';
import { Button } from '../ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Conversation, Message } from '@/types/types';
import axios from 'axios';
import { getTokenFromCookies, getUserIdFromToken } from '@/lib/utils';

interface ChatUiProps {
  currentConversation: Conversation;
  goBackToMessages: () => void;
}

export const ChatUi: React.FC<ChatUiProps> = ({ currentConversation, goBackToMessages }) => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(currentConversation);

  // Handle sending the message
  const handleSendMessage = async () => {
    if (!currentConversation || !currentConversation.id || currentConversation.id.length !== 24) {
      console.error('Invalid conversation ID');
      return;
    }

    const token = getTokenFromCookies();
    const userId = getUserIdFromToken();

    if (!token || !userId) {
      console.error('Token or userId is missing!');
      return;
    }

    if (input.trim()) {
      // Create a new message object for the user
      const newMessage: Message = { role: 'user', content: input };

      // Update conversation locally with the user's message
      let updatedConversation: Conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        lastUsed: new Date(),
      };

      setConversation(updatedConversation);

      setInput(''); // Clear input field

      // Send the message to the backend and get GPT-4's response
      try {
        const response = await axios.post(
          `http://localhost:4000/chat/${currentConversation.id}`,
          { message: input },
          {
            withCredentials: true, // Ensure cookies are sent
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Create an assistant message from the response
        const aiMessage: Message = {
          role: 'ai',
          content: response.data,
        };

        // Update conversation with assistant's response
        updatedConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, newMessage],
          lastUsed: new Date(),
        };

        setConversation(updatedConversation);
      } catch (error) {
        console.error('Error sending message to GPT-4:', error);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Back Button */}
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={goBackToMessages}>
          <ArrowLeftIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Message List and Input Area */}
      <div className="flex-grow">
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
          <div>No conversation selected</div>
        )}
      </div>
    </div>
  );
};
