// components/ConversationList.tsx

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrashIcon } from "lucide-react";
import { format } from "date-fns";

type Conversation = {
  id: number;
  title: string;
  lastUsed: Date;
};

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: number) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
}) => {
  return (
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
                {format(conv.lastUsed, "MMM d, yyyy")}
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
  );
};
