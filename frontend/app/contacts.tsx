import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosConfig';
import { ChatAssistant, Conversation } from '@/types/types';
import { getUserIdFromToken } from '@/lib/utils';

interface ContactsProps {
  setCurrentView: (view: 'contacts' | 'assistantBuilder' | 'chat') => void;
  setConversation: (conversation: Conversation) => void;
}

const Contacts: React.FC<ContactsProps> = ({ setCurrentView }) => {
  const [assistants, setAssistants] = useState<ChatAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [userId, setUserId] = useState<string | null>('66e8da98be24f83613de9809')
  const enableAuth = process.env.ENABLE_AUTH === 'true'
    if (enableAuth){
      setUserId(getUserIdFromToken())
    }

  useEffect(() => {
    // Fetch assistants (contacts)
    const fetchChatAssistants = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/assistant/${userId}`, {
      });
      console.log("Fetching assistants: " + response)
        setAssistants(response.data);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    fetchChatAssistants();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleAddContact = () => {
    setCurrentView('assistantBuilder'); 
  };

  const handleChat = async (assistant: ChatAssistant) => {
    try {
      console.log('Opening chat UI for Assistant: ', assistant)

      //checking if conversation exists
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/assistant/${assistant.assistantId}`);
      const conversationData = response.data.messages;
      console.log('Conversation Data: ', conversationData)
      //If exists pass to chat-ui
      if (conversationData) {
        const conversation: Conversation = {
          id: conversationData._id,
          messages: [conversationData],
          lastUsed: new Date(),
          assistant: assistant.assistantId,
          assistantName: assistant.name
        }
        this.setConversation(conversation);
        setCurrentView('chat');
      } else {
        //if no conversation create new one
        const tempConversation: Conversation = {
          id: '',
          assistant: assistant.assistantId,
          assistantName: assistant.name,
          messages: [],
          lastUsed: new Date
        }
        this.setConversation(tempConversation);
        setCurrentView('chat')
      }
    }
      catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <div className="p-2">
      {/* List of assistants */}
      {assistants.length > 0 ? (
        <ul className="mb-4">
          {assistants.map((assistant: ChatAssistant) => (
            <li key={assistant.assistantId} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{assistant.name}</span>
                <Button onClick = {() => handleChat(assistant)}>Chat with {assistant.name}</Button>
              </div>
              <p>{assistant.background.slice(0, 50)}</p>
              <p>Personality: {assistant.personality}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found. Add a contact to start a conversation!</p>
      )}

      {/* Add Contact Button */}
      <Button onClick={handleAddContact} variant="outline">
        Add Contact
      </Button>
    </div>
  );
};

export default Contacts;
