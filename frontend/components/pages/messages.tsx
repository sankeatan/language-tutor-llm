'use client';

import { useState, useEffect } from 'react';
import { ConversationList } from '../chat/conversation-list';
import Contacts from './contacts';
import Feedback from './feedback';
import { getTokenFromCookies, getUserIdFromToken, } from "@/lib/utils";
import axios from 'axios';
import { Conversation, Message } from "@/types/types";
import { getRandomGreeting } from '@/lib/utils';
import { HeaderMenu } from '../chat/header-menu';
import Login from './login';
import ChatAssistantBuilder from './chat-assistant-builder';

export const Messages: React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentView, setCurrentView] = useState<'messages' | 'feedback' | 'contacts' | 'assistantBuilder'>('messages');

    // Fetch userId and token on load
    useEffect(() => {
      const fetchedToken = getTokenFromCookies();
      const fetchedUserId = getUserIdFromToken();
      
      setUserId(fetchedUserId);
      setToken(fetchedToken);
    }, []);
    
    useEffect(() => {
      if (userId && token && currentView === 'messages') {
        console.log("Fetching conversations for userId:", userId);
  
        axios
          .get(`http://localhost:4000/chat/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response)
            setConversations(response.data);
          })
          .catch((err) => console.error("Failed to fetch conversations:", err));
      }
    }, [userId, token, currentView]);

    if (!userId) {
      return <Login setUserId={setUserId} />;
    }

    const onNewConversation = (newConversation: Conversation) => {
      setConversations([...conversations, newConversation]);
    };

    const handleCreateNewConversation = async () => {
    const greeting = getRandomGreeting();
    const title = `New Conversation ${conversations.length + 1}`;
    const message: Message = { role: 'user', content: greeting };

    if (!token || !userId) {
      console.error('Token or userId is missing!');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/chat/create',
        { userId, title, messages: message },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const conversationData = response.data;

      const newConversation: Conversation = {
        id: conversationData._id,
        title: title,
        messages: [message],
        lastUsed: new Date(),
        assistant: conversationData.assistant,
        assistantName: conversationData.assistantName,
      };

      onNewConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        {/* Central title - Changes based on current view */}
        <h1 className="text-2xl font-bold mb-4">
          {currentView === 'messages' ? 'Messages' : currentView === 'contacts' ? 'Contacts' : 'Feedback'}
        </h1>
  
        {/* HeaderMenu remains on all views */}
        <HeaderMenu setCurrentView={setCurrentView} />
      </div>
  
  
      {/* Conversation List or Contacts/Feedback based on currentView */}
      <div className="p-4 space-y-4">
        {currentView === 'messages' && (
          <ConversationList
            userId={userId}
            token={token}
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
            onCreateNewConversation={handleCreateNewConversation}
          />
        )}
        {currentView === 'contacts' && <Contacts setCurrentView={setCurrentView} />}
        {currentView === 'feedback' && <Feedback />}
        {currentView === 'assistantBuilder' && <ChatAssistantBuilder />}
      </div>
    </div>
  );
  }