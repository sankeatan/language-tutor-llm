import { useState } from 'react';
import { MessageList } from '../components/chat/message-list';
import { InputArea } from '../components/chat/input-area';
import { Button } from '../components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { Conversation, Message } from '@/types/types';
import axiosInstance from '@/lib/axiosConfig';
import { threadId } from 'worker_threads';

interface ChatUiProps {
  currentConversation: Conversation;
  goBackToMessages: () => void;
}

export const ChatUi: React.FC<ChatUiProps> = ({currentConversation, goBackToMessages }) => {
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState<Conversation>(currentConversation);
  const [isFirstMessage, setIsFirstMessage] = useState(!conversation?.id)

  // Handle sending the message
  const handleSendMessage = async () => {
    if (input.trim()){
      if(!conversation) return
      
      const newMessage: Message = { role: 'user', content: input};
      if (isFirstMessage) {
        try {
          const response = await axiosInstance.post('/assistant/run-thread', {
            threadId: threadId,
            message: conversation?.messages[0].content,
          });
          const assistantResponse = response.data
          setConversation({
            ...conversation,
            messages: [...conversation.messages, newMessage],
            lastUsed: new Date()
          })
        } catch (error) {
          
        }
      } 
    }
    
      //create new message object
      const newMessage: Message = { role: 'user', content: input};
      if (isFirstMessage) {
        try {
          //create new thread for assistant
          const threadResponse = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/create`,
              {
                assistant: conversation.assistant,
                assistantName: conversation.assistantName,
                messages: [newMessage]
              }
          );
          const newThread = threadResponse.data;
          setConversation({ ...conversation, id: newThread.conversationId, messages: [newMessage] });
          setIsFirstMessage(false);
        } catch (error) {
          console.error('Failed to create a thread: ', error);
          return
        }
      } else {
        // If a conversation already exists, add a message to it
        try {
          //add user's message to the chat-ui
          setConversation({
            ...conversation,
            messages: [...conversation.messages, newMessage],
            lastUsed: new Date(),
          })
          const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/${conversation.id}`,
            { message: input}
          );

          //Assistant message from response
          const aiMessage: Message = {
            role: 'ai',
            content: response.data
          };

          setConversation({
            ...conversation,
            messages: [...conversation.messages, aiMessage],
            lastUsed: new Date()
          })
        } catch (error){
          console.log('Failed to fetch thread', error)
        }
      }
    }


    if (!currentConversation || !currentConversation.id || currentConversation.id.length !== 24) {
      console.error('Invalid conversation ID');
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
        const response = await axiosInstance.post(
          `${process.env.NEXT_PUBLIC_API_URL}/chat/${currentConversation.id}`,
          { message: input },
          {
            withCredentials: true, // Ensure cookies are sent
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
