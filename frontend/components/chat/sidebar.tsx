'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusIcon, TrashIcon } from "lucide-react"
import { format } from "date-fns"
import { Conversation } from "@/types/types"
import { getTokenFromCookies, getUserIdFromToken } from "@/lib/utils"
import axios from "axios"


interface SidebarProps {
  conversations: Conversation[];
  onNewConversation: (conversation: Conversation) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation
}) => {
    const handleCreateNewConversation = async () => {
        const token = getTokenFromCookies();
        const userId = getUserIdFromToken();
        try {
            const response = await axios.post(
              'http://localhost:4000/chat/create',
              { userId, messages: [] },
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
              title: `New Conversation ${conversations.length + 1}`,
              messages: [], // No messages yet
              lastUsed: new Date(),
            };
      
            // Pass the new conversation to the parent component
            onNewConversation(newConversation);
      
          } catch (error) {
            console.error('Error creating conversation:', error);
          }
        };
  return (
    <div className="w-[300px] sm:w-[400px] bg-white dark:bg-gray-800 p-4">
      <h2 className="text-lg font-semibold mb-4">Conversations</h2>
      <Button 
        variant="outline" 
        className="w-full mb-4"
        onClick={()=> {handleCreateNewConversation}}
      >
        <PlusIcon className="mr-2 h-4 w-4" /> New Conversation
      </Button>
      <ScrollArea className="h-[calc(100vh-180px)]">
        {conversations.map((conv) => (
          <div key={conv.id} className="flex items-center mb-2">
            <Button
              variant="ghost"
              className="w-full justify-start mr-2"
              onClick={() => onSelectConversation(conv)}
            >
              <div className="flex flex-col items-start">
                <span>{conv.title}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(conv.lastUsed, 'MMM d, yyyy')}
                </span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteConversation(conv.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
