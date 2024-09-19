'use client'

import { useEffect, useState } from 'react';
import { MessageList } from './message-list';
import { InputArea } from './input-area';
import { NewConversationScreen } from './new-conversation-screen';
import { Sidebar } from './sidebar'
import { HeaderMenu } from './header-menu'
import axios from 'axios';
import { getUserIdFromToken, getTokenFromCookies, getRandomGreeting } from '@/lib/utils';
import { Conversation, Message } from '@/types/types'
import { GrammarLessons } from '../pages/grammar-lessons';
import { PronunciationLessons } from '../pages/pronunciation-lessons';
import { UserFeedback } from '../pages/user-feedback';
import Login  from '@/components/pages/login'

export function ChatUi() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [currentView, setCurrentView] = useState<'chat' | 'grammar' | 'pronunciation' | 'feedback'>('chat')
  const [newConversationMethod, setNewConversationMethod] = useState<'voice' | 'media' | 'text' | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const fetchedUserId = getUserIdFromToken();
    const fetchedToken = getTokenFromCookies();

    setUserId(fetchedUserId);
    setToken(fetchedToken);
  }, []);

  if (!userId) {
    return <Login setUserId={setUserId} />;
  }

  // Function to handle sending the message
  const handleSendMessage = async () => {
    console.log("Send button clicked"); // Check if function is triggered
    if (!currentConversation) {
        console.error('No active conversation')
        return;
    }

    const token = getTokenFromCookies(); 
    if (!token) {
        console.error('No token found!');
        return;
    }
    
    const userId = getUserIdFromToken();  
    if (!userId) {
      console.error('Unable to retrieve userId or token');
      return;
    }

    console.log("User ID: ", userId); // Log userId
    console.log("Token: ", token) //Log token

    if (input.trim() && currentConversation) {
        console.log("Sending message to existing conversation:", currentConversation.id); // Log message and conversationId
      
        const newMessage: Message = { role: 'user', content: input };

      // Update current conversation with user message
      let updatedConversation: Conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, newMessage],
        lastUsed: new Date(),
      };

      // Clear input field
      setInput('');
      setCurrentConversation(updatedConversation);
      setConversations(
        conversations.map((conv) =>
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );

      // Send the message to the backend
      try {
        const response = await axios.post(
          `http://localhost:4000/chat/${currentConversation.id}`,
          {
            message: input,
          },
          {
            withCredentials: true, // Ensure that cookies (with JWT) are sent
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
              },
          }
        );
        console.log(response)

        const aiMessage: Message = {
            role: 'ai',
            content: response.data
        };
        console.log(aiMessage)
        if (!aiMessage) {
            console.error("Invalid conversation data:", aiMessage);
            return;
          }

        updatedConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiMessage],
          lastUsed: new Date(),
        };

        setCurrentConversation(updatedConversation);
        setConversations(
          conversations.map((conv) =>
            conv.id === currentConversation.id ? updatedConversation : conv
          )
        );
      } catch (error) {
        console.error('Error updating conversation:', error);
      }
    } 
    // Clear input field after sending the message
    setInput('');
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (currentConversation && currentConversation.id === id) {
      setCurrentConversation(null);
    }
  };

  const handleNewConversation = async () => {
    console.log("New conversation started")
    const token = getTokenFromCookies();
    console.log("token: ", token)
    const userId = getUserIdFromToken();
    console.log("userId: ", userId)
    const greeting = getRandomGreeting();
    console.log("greeting: ", greeting)

    // Prepare a new conversation locally (with a temporary ID)
    const newTempConversation: Conversation = {
        id: (conversations.length + 1).toString(),
        title: `New Conversation ${conversations.length + 1}`,
        messages: [{ role: 'user', content: greeting }], // Greeting as the first message
        lastUsed: new Date(),
    };

    // Set the new conversation in the state
    setCurrentConversation(newTempConversation);
    setConversations([...conversations, newTempConversation]);

    try {
        const response = await axios.post('http://localhost:4000/chat/create', {
            userId,
            messages: [{ role: 'user', content: greeting }]
        }, {
            withCredentials: true, // Ensure that cookies (with JWT) are sent
            headers: {
                Authorization: `Bearer ${token}`,  // Attach the token in the Authorization header
            }
        });
        console.log(response)

        const conversationData = response.data.conversation;
        console.log(conversationData)

      // Update the conversation with the real backend ID
        const updatedConversation: Conversation = {
            id: conversationData._id, // Use MongoDB _id from backend
            title: `New Conversation ${conversations.length}`,
            messages: conversationData.messages, // Retain the greeting message
            lastUsed: new Date(),
        };

        // Clear input field
        setInput('');
        setCurrentConversation(updatedConversation);
        setConversations(
            conversations.map((conv) =>
            conv.id === newTempConversation.id ? updatedConversation : conv
            )
        );

    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
       {/* Header */}
        <HeaderMenu currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="flex flex-grow">

        {/* Sidebar */}
            <Sidebar
                userId={userId}
                token={token}
                conversations={conversations}
                onNewConversation={handleNewConversation}
                onSelectConversation={handleSelectConversation}
                onDeleteConversation={handleDeleteConversation}
        />
        
        {/* Main content area */}
      <div className="flex-grow">
        {currentView === 'chat' && (
          currentConversation ? (
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
            <NewConversationScreen startNewConversation={handleNewConversation} />
          )
        )}

        {currentView === 'grammar' && <GrammarLessons />}
        {currentView === 'pronunciation' && <PronunciationLessons />}
        {currentView === 'feedback' && <UserFeedback />}
      </div>
    </div>
  </div>
);
}
