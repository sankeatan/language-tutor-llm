'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ChatAssistant, Conversation } from '@/types/types';
import { getTokenFromCookies, getUserIdFromToken } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ContactsProps {
  setCurrentView: (view: 'contacts' | 'assistantBuilder' | 'chat') => void;
  setConversation: (conversation: Conversation) => void;
}

const Contacts: React.FC<ContactsProps> = ({ setCurrentView }) => {
  const [assistants, setAssistants] = useState<ChatAssistant[]>([]);
  const [expandedAssistant, setExpandedAssistant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const token = getTokenFromCookies()
  const userId = getUserIdFromToken()
  const router = useRouter();

  const handleToggleExpand = (assistantId: string) => {
    setExpandedAssistant((prev) => (prev === assistantId ? null : assistantId));
  };


  useEffect(() => {
    // Fetch assistants (contacts)
    const fetchChatAssistants = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/assistant/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
      });
        setAssistants(response.data);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        setError('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchChatAssistants();
    }
  }, [userId, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleAddContact = () => {
    setCurrentView('assistantBuilder'); 
  };

  const handleChat = async (assistant: ChatAssistant) => {
    try {
      const response = await axios.get(`http://localhost:4000/chat/${assistant.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const conversations = response.data;
      const existingConversation = conversations.find((conv: any) => conv.assistant === assistant.id);

      if (existingConversation) {
        // Navigate to the existing conversation
        setCurrentView('chat')
      } else {
        // Create a new conversation with the assistant
        const newConversation = await axios.post(
          'http://localhost:4000/chat/create',
          {
            userId,
            assistant: assistant.id,
            assistantName: assistant.name,
            messages: [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        router.push(`/chat/${newConversation.data._id}`);
      }
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  return (
    <div className="p-2">
      {/* List of assistants */}
      {assistants.length > 0 ? (
        <ul className="mb-4">
          {assistants.map((assistant) => (
            <li key={assistant.id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{assistant.name}</span>
                <Button onClick = {handleChat(assistant)}>Chat with {assistant.name}</Button>
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
