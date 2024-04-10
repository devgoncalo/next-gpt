import useSWR from "swr";

import { chatsAtom, openAISettingsAtom } from "@/atoms/chat";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { ChatWithMessageCountAndSettings } from "@/types/collections";

import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useChats = () => {
  // Auth & Supabase
  const { user } = useAuth();
  const { supabase } = useSupabase();

  // States
  const openAISettings = useAtomValue(openAISettingsAtom);
  const [chats, setChats] = useAtom(chatsAtom);

  const router = useRouter();

  // Fetch Chats
  const fetcher = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(`*, messages(count)`)
      .eq("owner", user?.id as string)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((chat) => {
      return {
        ...chat,
        advanced_settings: JSON.parse(chat.advanced_settings as string),
      };
    }) as any;
  };

  const { data, error, isLoading, mutate } = useSWR(
    user ? ["chats", user.id] : null,
    fetcher
  );

  // Add New Chat Handler
  const addChatHandler = async () => {
    const { data: newChat, error } = await supabase
      .from("chats")
      .insert({
        owner: user?.id,
        model: openAISettings.model,
        system_prompt: openAISettings.system_prompt,
        advanced_settings: JSON.stringify(openAISettings.advanced_settings),
        history_type: openAISettings.history_type,
        title: "New Chat",
      })
      .select(`*`)
      .returns<ChatWithMessageCountAndSettings[]>()
      .single();

    if (error && !newChat) {
      console.log(error);
      return;
    }

    // Add it to the top of the list
    mutate((prev: any) => {
      if (prev && prev.length > 0) {
        return [newChat, ...prev];
      } else {
        return [newChat];
      }
    });

    // Redirect to the new chat
    router.prefetch(`/chat/${newChat.id}`);
    router.push(`/chat/${newChat.id}`);
  };

  // Remove a Chat Handler
  const deleteChat = async (chatId: string) => {
    // Delete all messages associated with the chat
    const { error: messageError } = await supabase
      .from("messages")
      .delete()
      .eq("chat", chatId);

    if (messageError) {
      console.log(messageError);
      return;
    }

    // Delete the chat itself
    const { error: chatError } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId);
      
    if (chatError) {
      console.log(chatError);
      return;
    }

    // Update the chats state by removing the deleted chat
    mutate(
      (prev: any) => prev.filter((chat: any) => chat.id !== chatId),
      false
    );

    // Redirect to the home page if the deleted chat was the current route
    router.push(`/chat`);
    router.refresh();
  };

  // Clear All Chats Handler
  const clearChats = async () => {
    try {
      // Fetch the chat IDs associated with the user
      const { data: chatIds, error: chatIdsError } = await supabase
        .from("chats")
        .select("id")
        .eq("owner", user?.id as string);

      if (chatIdsError) {
        console.error(chatIdsError);
        return;
      }

      // Extract chat IDs from the fetched data
      const chatIdsArray = chatIds?.map((chat) => chat.id);

      if (chatIdsArray && chatIdsArray.length > 0) {
        // Delete all messages associated with the user's chats
        const { error: messageError } = await supabase
          .from("messages")
          .delete()
          .in("chat", chatIdsArray);

        if (messageError) {
          console.error(messageError);
          return;
        }
      }

      // Delete all chats owned by the user
      const { error: chatError } = await supabase
        .from("chats")
        .delete()
        .eq("owner", user?.id as string);

      if (chatError) {
        console.error(chatError);
        return;
      }

      // Update the chats state by removing all chats
      mutate([]);

      // Redirect to the home page if the deleted chat was the current route
      router.push(`/chat`);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  // Update Chat Title Handler
  const updateChatTitle = async (chatId: string, newTitle: string) => {
    const { error } = await supabase
      .from("chats")
      .update({ title: newTitle })
      .eq("id", chatId);

    if (error) {
      console.log(error);
      return;
    }

    // Update the chats state with the new chat title
    mutate((prev: any) =>
      prev.map((chat: any) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  // Set Chats
  useEffect(() => {
    setChats(data ?? []);
  }, [data, setChats]);

  return {
    chats,
    isLoading,
    error,
    mutate,
    addChatHandler,
    deleteChat,
    clearChats,
    updateChatTitle,
  };
};

export default useChats;
