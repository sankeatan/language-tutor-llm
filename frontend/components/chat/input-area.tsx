// components/InputArea.tsx

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MicIcon, PaperclipIcon, SendIcon } from "lucide-react";

interface InputAreaProps {
  input: string;
  setInput: (input: string) => void;
  onSendMessage: () => void;
  handleMicrophoneStart: () => void;
  handleMicrophoneEnd: () => void;
  handlePaperclipClick: () => void;
}

export const InputArea: React.FC<InputAreaProps> = ({
  input,
  setInput,
  onSendMessage,
  handleMicrophoneStart,
  handleMicrophoneEnd,
  handlePaperclipClick,
}) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onMouseDown={handleMicrophoneStart}
          onMouseUp={handleMicrophoneEnd}
          onTouchStart={handleMicrophoneStart}
          onTouchEnd={handleMicrophoneEnd}
        >
          <MicIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePaperclipClick}>
          <PaperclipIcon className="h-4 w-4" />
        </Button>
        <Input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow mx-2"
        />
        <Button
            onClick={() => {
            console.log("Button clicked"); // Check if the button click is registered
            onSendMessage();
        }}
        disabled={!input.trim()}
>
        <SendIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
