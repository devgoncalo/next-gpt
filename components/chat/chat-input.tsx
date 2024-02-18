"use client";

import {
  addMessageAtom,
  cancelHandlerAtom,
  chatIDAtom,
  currentChatHasMessagesAtom,
  inputAtom,
  regenerateHandlerAtom,
} from "@/atoms/chat";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useChats from "@/hooks/useChats";
import useSpeechToText from "@/hooks/useSpeechToText";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { RefreshCw, Send, StopCircle, Share, Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import ChatSettingsMenu from "./chat-settings-menu";

const ChatInput = () => {
  const { addChatHandler } = useChats();

  const [inputValue, setInputValue] = useAtom(inputAtom);
  const [isHandling, addMessageHandler] = useAtom(addMessageAtom);
  const [isRegenerateSeen, regenerateHandler] = useAtom(regenerateHandlerAtom);

  const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
  const cancelHandler = useSetAtom(cancelHandlerAtom);
  const chatID = useAtomValue(chatIDAtom);

  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] =
    useState(false);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasChatMessages && !chatID) {
      await addChatHandler();
    } else {
      if (isSpeechRecognitionActive) {
        // Set the Speech Recognition to False Before Sending the Message
        setIsSpeechRecognitionActive(false);
      }
      await addMessageHandler("generate");
    }
  };

  // Enter Key Handler
  const handleKeyDown = useCallback(
    async (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!hasChatMessages && !chatID) {
          await addChatHandler();
        } else {
          await addMessageHandler("generate");
        }
      }
    },
    [hasChatMessages, chatID, addMessageHandler, addChatHandler]
  );

  // Subscribe to Key Down Event
  useEffect(() => {
    addEventListener("keydown", handleKeyDown);
    return () => removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    setIsButtonActive(inputValue.trim().length > 0);
  }, [inputValue]);

  const {
    start: startSpeechRecognition,
    stop: stopSpeechRecognition,
    transcript,
  } = useSpeechToText();

  const handleSpeechRecognitionToggle = () => {
    if (isSpeechRecognitionActive) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
    setIsSpeechRecognitionActive(!isSpeechRecognitionActive);
  };

  // Update input value with the transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript, setInputValue]);

  return (
    <div className="sticky bottom-0 left-0 right-0 px-4 py-10 sm:px-8 bg-gradient-to-b from-transparent dark:via-neutral-950/60 dark:to-neutral-950/90 via-neutral-50/60 to-neutral-50/90">
      {/* Container */}
      <div className="w-full max-w-5xl mx-auto">
        {/* Abort Controller */}
        {isHandling && (
          <div
            key="handling"
            className="flex items-center justify-center w-full max-w-5xl py-4"
          >
            <Button
              variant="test"
              size="test"
              className="flex items-center gap-2"
              onClick={cancelHandler}
            >
              <StopCircle size="14" /> <span>Stop Generating</span>
            </Button>
          </div>
        )}
        {/* Regenerate Controller - Desktop */}
        {!isHandling && isRegenerateSeen && (
          <div
            key="regenerate"
            className="flex items-center justify-center py-2 sm:flex gap-2"
          >
            <Button
              variant="test"
              size="test"
              className="flex items-center gap-2"
              onClick={regenerateHandler}
            >
              <RefreshCw size="14" /> <span>Regenerate Response</span>
            </Button>
            {/* <Button
              variant="test"
              size="test"
              className="flex items-center gap-2"
            >
              <Share size="14" /> <span>Share</span>
            </Button>*/}
          </div>
        )}
        {/* Settings */}
        {hasChatMessages && <ChatSettingsMenu />}
        {/* Input Container */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full py-2 bg-white rounded-md shadow-sm focus-within:ring-neutral-300 dark:focus-within:ring-neutral-500 focus-within:ring-1 dark:bg-neutral-900"
        >
          <Textarea
            className="h-auto peer ml-1 pr-[5.5rem]"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button
            type="button"
            className={`absolute max-sm:left-[78%] left-[92%] bottom-3 mr-4 py-[6px] px-[6px] rounded-md ${
              isSpeechRecognitionActive
                ? "text-neutral-100 dark:text-neutral-800 hover:text-neutral-600 bg-slate-800 dark:bg-slate-100 hover:bg-slate-200"
                : "dark:bg-neutral-800 bg-neutral-100 hover:dark:bg-neutral-700 text-neutral-600 hover:text-neutral-400"
            }`}
            onClick={handleSpeechRecognitionToggle}
          >
            {isSpeechRecognitionActive ? (
              <MicOff
                size="18"
                className="dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
              />
            ) : (
              <Mic
                size="18"
                className="dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
              />
            )}
          </button>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger>
                <button
                  type="submit"
                  className={`absolute max-sm:left-[88%] left-[95.5%] bottom-3 mr-4 py-[6px] px-[6px] rounded-md ${
                    isButtonActive
                      ? "text-neutral-100 dark:text-neutral-800 hover:text-neutral-600 bg-slate-800 dark:bg-slate-100 hover:bg-slate-200"
                      : "dark:bg-neutral-800 bg-neutral-100 hover:dark:bg-neutral-700 text-neutral-600 hover:text-neutral-400"
                  }`}
                >
                  <Send
                    size="18"
                    className="dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                className="mb-6 mr-16 max-sm:hidden max-md:hidden"
                side="top"
              >
                <p>Send message</p>
                <div className="arrow" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
