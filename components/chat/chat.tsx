import useChats from "@/hooks/useChats";
import Link from "next/link";

import { mobileMenuAtom } from "@/atoms/navigation";
import { ChatWithMessageCountAndSettings } from "@/types/collections";
import { titleCase } from "@/utils/helpers";

import { useSetAtom } from "jotai";
import { DateTime } from "luxon";
import { useState, useEffect, useRef, useCallback } from "react";

import { MessageCircle, Trash2, Pencil, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Chat = ({ chat }: { chat: ChatWithMessageCountAndSettings }) => {
  const showMobileMenu = useSetAtom(mobileMenuAtom);

  const { deleteChat } = useChats();
  const { updateChatTitle } = useChats();

  const [showOptionsButtons, setShowOptionsButtons] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [originalTitle, setOriginalTitle] = useState(chat.title);
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleTitleUpdate = () => {
    setEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTitleConfirm = useCallback(() => {
    updateChatTitle(chat.id, newTitle as string);
    setOriginalTitle(newTitle);
    setEditingTitle(false);
  }, [chat.id, newTitle, setEditingTitle, updateChatTitle]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingTitle &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleTitleConfirm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTitle, handleTitleConfirm]);

  return (
    <Link
      onClick={() => {
        showMobileMenu(false);
      }}
      title={chat.title as string}
      href={`/chat/${chat.id}`}
    >
      <div className="flex items-center w-full gap-2 px-3 py-2 transition-colors duration-100 ease-in-out rounded-md bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800">
        {editingTitle ? (
          <input
            ref={inputRef}
            type="text"
            value={newTitle as string}
            onChange={handleTitleChange}
            autoFocus
            className={`w-full text-sm leading-[1.65rem] line-clamp-1 rounded-sm border border-white outline-none ${
              editingTitle ? "" : "hidden"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleTitleConfirm();
              }
            }}
          />
        ) : (
          <div className="text-sm leading-loose line-clamp-1 min-w-[7.8rem]">
            {chat.title}
          </div>
        )}
        {/* Options Button */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={`flex items-center w-full justify-center py-1 px-1 ml-12 rounded-sm dark:hover:bg-neutral-900 hover:bg-neutral-200 ${
              editingTitle ? "hidden" : ""
            }`}
            asChild
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsButtons(!showOptionsButtons);
              }}
            >
              <MoreHorizontal className="shrink-0" size="16" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full mb-2"
            side="bottom"
            align="start"
            hidden={deleteDialogOpen == true}
          >
            <DropdownMenuItem
              onSelect={() => {
                handleTitleUpdate();
              }}
              className="text-neutral-700 dark:text-neutral-100"
            >
              <Pencil size="16" className="mr-2" />
              Rename
            </DropdownMenuItem>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger
                className="relative w-[100%] flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700"
                asChild
              >
                <div className="flex items-center text-red-500">
                  <Trash2 size="16" className="mr-2" />
                  Delete chat
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete{" "}
                    <strong className="text-black dark:text-white">
                      {chat.title}
                    </strong>
                    {" "}and its messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteChat(chat.id);
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Meta */}
      <div className="flex items-center mt-1 dark:text-neutral-600 text-neutral-400">
        <div className="text-xs">
          {titleCase(
            DateTime.fromISO(chat.created_at as string).toRelativeCalendar()!!
          )}
        </div>
        <div className="w-1 h-1 mx-2 rounded-full dark:bg-neutral-700 bg-neutral-500" />
        <div className="flex items-center gap-1 text-xs">
          {chat.messages?.[0]?.count} <MessageCircle size="14" />
        </div>
      </div>
    </Link>
  );
};

export default Chat;
