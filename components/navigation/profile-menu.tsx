"use client";

import { openAPIKeyHandlerAtom } from "@/atoms/chat";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useSetAtom } from "jotai";
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
import {
  LogOut,
  RefreshCcw,
  Moon,
  Sun,
  MoreHorizontal,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useChats from "@/hooks/useChats";

const ProfileMenu = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { clearChats } = useChats();

  const apiKeyHandler = useSetAtom(openAPIKeyHandlerAtom);
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center w-full gap-3 py-1 px-1 rounded-md dark:hover:bg-neutral-900 hover:bg-neutral-100">
        <Avatar>
          <AvatarImage src={user?.avatar_url ?? ""} />
          <AvatarFallback>
            {user?.full_name?.slice(0, 2).toLocaleUpperCase() ?? " "}
          </AvatarFallback>
        </Avatar>

        <div className="flex justifiy-center items-center space-x-10 text-left whitespace-nowrap">
          <div className="text-base">{user?.full_name}</div>
          <MoreHorizontal size="16" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full mb-2" side="top" align="start">
        <DropdownMenuItem>
          <ExternalLink size="14" className="mr-2" />
          <Link href="#" className="mr-[6.3rem]">
            Help & FAQ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger
            className="relative w-[100%] flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700"
            asChild
          >
            <div className="flex items-center">
              <Trash2 size="14" className="mr-2" />
              Clear Conversations
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear conversations?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                your chats, messages and history.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => clearChats()}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DropdownMenuItem
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          {theme === "dark" ? (
            <Sun size="15" className="mr-2" />
          ) : (
            <Moon size="15" className="mr-2" />
          )}
          {theme === "dark" ? "Light Theme" : "Dark Theme"}
        </DropdownMenuItem>
        {/* <DropdownMenuItem
          onClick={() => {
            apiKeyHandler({
              action: "remove",
            });
            router.push("/chat");
          }}
        >
          <div className="flex items-center gap-2">
            <RefreshCcw size="14" /> Reset API Key
          </div>
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger
            className="relative w-[100%] flex cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm font-medium outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700"
            asChild
          >
            <div className="flex items-center text-red-500">
              <LogOut size="14" className="mr-2" />
              Log Out
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                We need you logged in to use our app. You will be logged and any
                unsaved changes may be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={signOut}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
