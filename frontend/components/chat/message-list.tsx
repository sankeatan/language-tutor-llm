// components/MessageList.tsx

import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  role: "user" | "ai";
  content: string;
};

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ScrollArea className="flex-grow p-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
        >
          <div
            className={`inline-block p-3 rounded-lg ${
              message.role === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
