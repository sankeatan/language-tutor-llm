'use client'

import React, { useState } from 'react';
import { HeaderMenu } from '@/components/chat/header-menu';
import Messages from '@/app/messages';
import Contacts from '@/app/contacts'
import Feedback from '@/app/feedback'
import ChatAssistantBuilder from '@/app/chat-assistant-builder';
import { Conversation } from "@/types/types";

const HomePage = () => { 
  const [conversation, setConversation] = useState<Conversation>({id: '', messages: [], lastUsed: new Date, assistant: '', assistantName: ''});
  const [currentView, setCurrentView] = useState<'contacts' | 'assistantBuilder' | 'chat' | 'feedback' | 'messages'>('messages');

    return (
      <div>
      {/* Header with view switching */}
      <HeaderMenu setCurrentView={setCurrentView} />
      
      {/* Conditional rendering based on the current view */}
      <div>
      {currentView === 'messages' && (<Messages/>)}
        {currentView === 'contacts' && (
          <Contacts
            setCurrentView={setCurrentView}
            setConversation={setConversation}
          />
        )}
        {currentView === 'feedback' && <Feedback/>}
        {currentView === 'assistantBuilder' && <ChatAssistantBuilder/>}
      </div>
    </div>
  );
}

export default HomePage