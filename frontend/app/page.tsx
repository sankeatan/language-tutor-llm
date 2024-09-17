import { ChatUi } from "@/components/pages/chat-ui";
import Image from "next/image";
import { useEffect } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation'

export default function Home() {
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  if (!token) {
    redirect('/login');
  } 
  else 
    return (
    <ChatUi></ChatUi>
  );
}
