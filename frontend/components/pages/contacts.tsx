'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ChatAssistant } from '@/types/types';
import { getTokenFromCookies, getUserIdFromToken } from '@/lib/utils';

interface ContactsProps {
  setCurrentView: (view: 'contacts' | 'assistantBuilder') => void; 
}

const Contacts: React.FC<ContactsProps> = ({ setCurrentView }) => {
  const [assistants, setAssistants] = useState<ChatAssistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const token = getTokenFromCookies()
  const userId = getUserIdFromToken()

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

  return (
    <div className="p-2">
      {/* List of assistants */}
      {assistants.length > 0 ? (
        <ul className="mb-4">
          {assistants.map((assistant) => (
            <li key={assistant.id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>{assistant.name}</span>
                <Button>Chat with {assistant.name}</Button>
              </div>
              <p>{assistant.background}</p>
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
