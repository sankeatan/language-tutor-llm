import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosConfig';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/types/types";
import { TrashIcon, PlusIcon, EditIcon } from "lucide-react";
import { formatTime, getInitials, getUserIdFromToken } from '@/lib/utils';

interface ConversationListProps {
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    onDeleteConversation: (id: string) => void;
    onCreateNewConversation: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    onSelectConversation,
    onDeleteConversation,
    onCreateNewConversation,
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const enableAuth = process.env.ENABLE_AUTH === 'true'
    const userId = '66e8da98be24f83613de9809'
    if (enableAuth){
      const userId = getUserIdFromToken();
    }

    // Fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      console.log(`Fetching conversations for userId: ${userId}`)

      try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/user/${userId}`, {
          withCredentials: true,
        });
        console.log("Chat history data: ", response)
        setConversations(response.data);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
      fetchConversations(); // Only fetch conversations if userId and token are available
  }, []);

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Edit and New Conversation Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost" size="sm">
          <EditIcon className="h-5 w-5" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onCreateNewConversation}>
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">New Conversation</span>
        </Button>
      </div>

      {/* Conversation List */}
      <ScrollArea className="h-[calc(100vh-180px)]">
      {Array.isArray(conversations) && conversations.length > 0 ?  (
        conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv)}
            className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {/* Profile Circle with Assistant Initials */}
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white">
              <span className="text-lg font-bold">
                {getInitials(conv.assistantName)}
              </span>
            </div>

            {/* Conversation Info */}
            <div className="flex-1 space-y-1">
              {/* Top row: Name and time */}
              <div className="flex justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatTime(conv.lastUsed)}
                </div>
              </div>

              {/* Middle and Bottom rows: Last message snippet */}
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {conv.messages[conv.messages.length - 1]?.content.slice(0, 50) || 'No messages yet'}
              </div>
            </div>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering conversation select
                onDeleteConversation(conv.id);
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ))
      ) : (
        <div>No conversations found</div>
      )}
    </ScrollArea>
    </>
  );
};
