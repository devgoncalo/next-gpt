"use client";
import { currentChatAtom, defaultSystemPropmt } from "@/atoms/chat";
import { useSupabase } from "@/lib/supabase/supabase-provider";
import { useAtom } from "jotai";
import debounce from "lodash.debounce";
import { Info } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TextareaDefault } from "../ui/textarea-default";

const NewChatCurrent = () => {
  const [currentChat, setCurrentChat] = useAtom(currentChatAtom);
  const { supabase } = useSupabase();

  // Send system prompt to supabase
  const sendSupabase = useCallback(
    async (value: string, id: string) => {
      await supabase
        .from("chats")
        .update({
          system_prompt: value,
        })
        .eq("id", id);
    },
    [supabase]
  );

  // Reset System Input to default
  const resetSystemInput = useCallback(async () => {
    setCurrentChat((prev) =>
      prev
        ? {
            ...prev,
            system_prompt: defaultSystemPropmt,
          }
        : prev
    );
    await sendSupabase(defaultSystemPropmt, currentChat?.id as string);
  }, [currentChat?.id, sendSupabase, setCurrentChat]);

  // Debounce the supabase call
  const debouncedSendSupabase = useMemo(
    () => debounce(sendSupabase, 1000),
    [sendSupabase]
  );

  return (
    <div className="flex items-start justify-center flex-1 w-full h-full sm:items-center mt-12 md:mt-0">
      {/* Container */}
      <div className="w-full max-h-full mb-8 px-8 py-10 mx-8 rounded-md shadow-sm md:max-w-xl dark:bg-neutral-950/30 bg-white/50">
        <div className="hidden md:flex flex-col">
          <h2 className="hidden md:inline text-lg font-medium">
            New here? We help you getting started!
          </h2>
          <p className="hidden md:inline mt-1 font-light dark:text-neutral-500">
            Please select your model and system propmt first. Then, you can{" "}
            <span className="font-medium dark:text-neutral-400">
              ask your first question
            </span>{" "}
            to start a new chat.
          </p>
        </div>

        {/* Settings */}
        <div className="md:mt-6">
          <Label>Language Model</Label>
          <Select
            defaultValue="gpt-3.5-turbo"
            onValueChange={async (value: "gpt-3.5-turbo") => {
              setCurrentChat((prev) =>
                prev ? { ...prev, model: value } : prev
              );
              // Save to supabase
              await supabase
                .from("chats")
                .update({
                  model: currentChat?.model,
                })
                .eq("id", currentChat?.id as string);
            }}
            value={currentChat?.model as string}
          >
            <SelectTrigger className="w-full mt-3">
              <SelectValue placeholder="GPT-3.5 Turbo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
          {currentChat?.model === "gpt-3.5-turbo" && (
            <div className="flex items-center gap-2 mt-3 dark:text-neutral-400">
              <Info size="14" />
              <div className="text-xs font-light ">
                GPT-3.5-Turbo is the cheapest and{" "}
                <span className="dark:text-neutral-300">the fastest</span> text
                generation model.
              </div>
            </div>
          )}
          <div className="mt-6">
            <Label>History Type</Label>
            <Select
              onValueChange={async (value: "global" | "chat") => {
                setCurrentChat((prev) =>
                  prev ? { ...prev, history_type: value } : prev
                );
                // Save to supabase
                await supabase
                  .from("chats")
                  .update({
                    history_type: currentChat?.history_type,
                  })
                  .eq("id", currentChat?.id as string);
              }}
              value={currentChat?.history_type}
            >
              <SelectTrigger className="w-full mt-3">
                <SelectValue placeholder="Select a model." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between w-full">
              <Label>System Propmt</Label>
              <button
                onClick={resetSystemInput}
                className="text-xs text-neutral-600"
              >
                Reset to Default
              </button>
            </div>
            <TextareaDefault
              value={currentChat?.system_prompt ?? defaultSystemPropmt}
              onChange={async (e) => {
                const value = e.target.value;
                setCurrentChat((prev) =>
                  prev
                    ? {
                        ...prev,
                        system_prompt: value ? value : defaultSystemPropmt,
                      }
                    : prev
                );
                await debouncedSendSupabase(
                  value ? value : defaultSystemPropmt,
                  currentChat?.id as string
                );
              }}
              className="mt-3 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatCurrent;
