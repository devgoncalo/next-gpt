"use client";

import { mobileMenuAtom } from "@/atoms/navigation";
import useChats from "@/hooks/useChats";
import { useAtom } from "jotai";
import { Plus } from "lucide-react";

import Chats from "../chat/chats";
import ProfileMenu from "./profile-menu";

const Sidebar = () => {
  const [isMobileMenuOpen, showMobileMenu] = useAtom(mobileMenuAtom);
  const { addChatHandler } = useChats();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-64 px-4 py-8 transition-transform -translate-x-full shadow-md md:translate-x-0 dark:border-neutral-800 border-neutral-200 bg-white dark:bg-neutral-950 dark:text-neutral-50 ${
        isMobileMenuOpen ? " !translate-x-0" : " "
      }`}
    >
      <div className="flex flex-col flex-1 h-full max-w-full">
        {/* Header */}
        <div>
          {/* New Chat Button */}
          <button
            onClick={() => {
              addChatHandler();
              showMobileMenu(false);
            }}
            className="flex items-center w-full gap-2 px-3 py-2 transition-colors duration-100 ease-in-out rounded-md bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800"
          >
            <Plus className="shrink-0" size="16" />
            <div className="text-sm leading-loose line-clamp-1">New Chat</div>
          </button>
          
        </div>
        <Chats />
        {/* Footer */}
        <div className="flex-1 mt-10">
          <ProfileMenu />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
