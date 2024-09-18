// components/NewConversationScreen.tsx

import { Button } from "@/components/ui/button";
import { MicIcon, PaperclipIcon, SendIcon } from "lucide-react";

interface NewConversationScreenProps {
  startNewConversation: () => void;
}

export const NewConversationScreen: React.FC<NewConversationScreenProps> = ({
  startNewConversation,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-8">
      <Button
        variant="outline"
        size="lg"
        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
        onClick={startNewConversation}
      >
        <MicIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
        <span className="text-xs sm:text-sm">Start a voice conversation</span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
        onClick={startNewConversation}
      >
        <PaperclipIcon className="h-8 w-8 sm:w-12 sm:h-12 mb-2" />
        <span className="text-xs sm:text-sm">Upload media for your tutor</span>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-center p-4"
        onClick={startNewConversation}
      >
        <SendIcon className="h-8 w-8 sm:h-12 sm:w-12 mb-2" />
        <span className="text-xs sm:text-sm">Send a text message</span>
      </Button>
    </div>
  );
};
