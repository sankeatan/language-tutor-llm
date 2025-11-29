import { useState, useEffect } from 'react';
import { ConversationList } from '../components/chat/conversation-list';
import { Conversation, Message } from "@/types/types";
import { getRandomGreeting } from '@/lib/utils';
import { ChatUi } from './chat-ui';
import axiosInstance from '@/lib/axiosConfig';
import { getUserIdFromToken } from '@/lib/utils';

const Messages: React.FC = () => { 
    const tempconv = {id: '', messages: [], lastUsed: new Date, assistant: '', assistantName: ''}
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation>(tempconv);
    const [searchTerm, setSearchTerm] = useState('');
    const enableAuth = process.env.ENABLE_AUTH === 'true'
    const userId = '66e8da98be24f83613de9809'
    if (enableAuth){
      const userId = getUserIdFromToken();
    }
    // Fetch userId and token on load
    useEffect(() => {
      const fetchConversations = async () => {
        try {
          console.log("Fetching messages for user: ", userId);
          const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/conversations/${userId}`);
          setConversations(response.data);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
  
      fetchConversations();
    }, []);

    const onNewConversation = (newConversation: Conversation) => {
      setConversations([...conversations, newConversation]);
    };

  const handleCreateNewConversation = async () => {
    const greeting = getRandomGreeting();
    const message: Message = { role: 'user', content: greeting };

    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/create`,
        { userId, messages: message },
        {
          withCredentials: true,
        }
      );

      const conversationData = response.data;

      const newConversation: Conversation = {
        id: conversationData._id,
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

  const handleSelectConversation = async (conversation: Conversation) => {
    try {
      // Check if a conversation already exists with this assistant
      const response = await axiosInstance.get(
        `http://localhost:4000/chat/assistant/${conversation.assistant}`,
        {
        }
      );
    setCurrentConversation(response.data);
  } catch (error) {
    console.error('Error fetching conversation:', error);
  }
  };
  const goBackToMessages = () => {
    setCurrentConversation(tempconv)
};


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 space-y-4">
                {/* Render ChatUi if a conversation is selected, otherwise show the ConversationList */}
                {currentConversation.id != tempconv.id ? (
                    <ChatUi 
                        currentConversation={currentConversation} 
                        goBackToMessages={goBackToMessages} />
                  ) : (
                    <ConversationList
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={(id) => setConversations(conversations.filter((conv) => conv.id !== id))}
                        onCreateNewConversation={() => {/* handle create new conversation */}}
                    />
                    )
                }
            </div>
        </div>
    );
  }

export default Messages