"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import ChatInput from "@/components/chat/chat-input";
import NewChat from "@/components/chat/new-chat";
import MobileMenuButton from "@/components/navigation/mobile-menu-button";
import useChats from "@/hooks/useChats";

export default function Home() {
  const pathname = usePathname();
  const { addChatHandler } = useChats();
  const [chatCreated, setChatCreated] = useState(false);

  if (!chatCreated && pathname === "/chat") {
    addChatHandler();
    setChatCreated(true);
  }
  
  return (
    <main className="relative flex flex-col items-stretch flex-1 w-full h-full ml-0 overflow-hidden transition-all transition-width md:ml-64 dark:bg-neutral-900 bg-neutral-50">
      <div className="flex-1 overflow-hidden">
        <MobileMenuButton />
        <NewChat />
        <ChatInput />
      </div>
    </main>
  );
}
