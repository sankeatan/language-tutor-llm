import { ChatUi } from "@/components/pages/chat-ui";
import Image from "next/image";
import { useEffect } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation'

export default function Home() {
    return (
    <ChatUi />
  );
}
