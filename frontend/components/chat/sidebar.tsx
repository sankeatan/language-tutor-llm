'use client';


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, MenuIcon, TrashIcon } from "lucide-react";
import { ConversationList } from './conversation-list';
import { getTokenFromCookies, getUserIdFromToken } from "@/lib/utils";
import axios from 'axios';
import { Conversation, Message } from "@/types/types";
import { getRandomGreeting } from '@/lib/utils';



interface SidebarProps {
    
  userId: string;
  token: string;
  conversations: Conversation[];
  onNewConversation: (conversation: Conversation) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userId,
  token,
  conversations,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);


    // Toggle sidebar collapse
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleCreateNewConversation = async () => {
        const token = getTokenFromCookies();
        const userId = getUserIdFromToken();
        const greeting = getRandomGreeting();
        const title = `New Conversation ${conversations.length + 1}`;
        const message: Message = {role: 'user', content: greeting}

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
      
            const conversationData = response.data.conversation;
      
            // Now create a new conversation object
            const newConversation: Conversation = {
              id: conversationData._id,
              title: title,
              messages: [message],
              lastUsed: new Date(),
            };
      
            // Pass the new conversation to the parent component
            onNewConversation(newConversation);
      
          } catch (error) {
            console.error('Error creating conversation:', error);
          }
        };
  return (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-[50px]' : 'w-[300px] sm:w-[400px]'} bg-white dark:bg-gray-800 p-4`}>
      {/* Collapsible Menu Button */}
      <div className="flex justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Conversations</h2>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* New Conversation Button */}
          <Button
            variant="outline"
            className="w-full mb-4"
            onClick={handleCreateNewConversation}
          >
            <PlusIcon className="mr-2 h-4 w-4" /> New Conversation
          </Button>

          {/* Conversation List */}
          <ConversationList
            userId={userId}
            token={token}
            conversations={conversations}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            
          />
        </>
      )}
    </div>
  );
};
