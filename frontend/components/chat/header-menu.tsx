'use client'

import { Button } from "@/components/ui/button"
import { UserDropdownMenu } from './dropdown-menu'  // Assuming you already modularized the dropdown
import { MessageCircleIcon, BarChartIcon, BookOpenIcon, VolumeIcon } from "lucide-react"
import { useRouter } from 'next/router';
import axios from "axios";
import { FC } from "react";

interface HeaderMenuProps {
  currentView: 'chat' | 'grammar' | 'pronunciation' | 'feedback';
  setCurrentView: (view: 'chat' | 'grammar' | 'pronunciation' | 'feedback') => void;

}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ currentView, setCurrentView }) => {
    const handleLogout = async () => {
        try {
            // Call backend logout to clear the cookie
            await axios.post('http://localhost:4000/auth/logout', {}, { withCredentials: true });
      
            // Clear token from client-side cookies
            document.cookie = 'token=; Max-Age=0; path=/';
      
          } catch (error) {
            console.error('Error logging out:', error);
          }
        }
  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('chat')}>
          <MessageCircleIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('grammar')}>
          <BookOpenIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('pronunciation')}>
          <VolumeIcon className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setCurrentView('feedback')}>
          <BarChartIcon className="h-6 w-6" />
        </Button>
      </div>
      <h1 className="text-lg font-semibold">GPTutor</h1>
      <UserDropdownMenu handleLogout={handleLogout}/>
    </header>
  )
};
