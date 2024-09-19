import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { Conversation } from "@/types/types";

interface ConversationListProps {
    userId: string;
    token: string;
    conversations: Conversation[];
    onSelectConversation: (conversation: Conversation) => void;
    onDeleteConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    onSelectConversation,
    onDeleteConversation,
    userId,
    token,
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch conversations when the component mounts
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);

      console.log(`Trying: http://localhost:4000/chat/user/:${userId}`)

      try {
        const response = await axios.get(`http://localhost:4000/chat/user/${userId}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Chat history data", response)
        // Assuming the response is { conversations: [...] }
        setConversations(response.data);
      } catch (err) {
        setError('Failed to fetch conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchConversations(); // Only fetch conversations if userId and token are available
    }
  }, [userId, token]);

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
        {Array.isArray(conversations) && conversations.length > 0 ? (
            conversations.map((conv) => (
                <div key={conv.id} className="flex items-center mb-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start mr-2"
                        onClick={() => onSelectConversation(conv)}
                    >
                        <div className="flex flex-col items-start">
                            <span>{conv.title}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(conv.lastUsed), "MMM d, yyyy")}
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
            ))
        ) : (
            <div>No conversations found</div>
        )}
    </ScrollArea>
);
};
