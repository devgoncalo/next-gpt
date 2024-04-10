import { MessageT } from "@/types/collections";
import { useAuth } from "@/lib/supabase/supabase-auth-provider";

import { Clipboard, User, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import gptAvatar from "@/assets/gpt-avatar.png";

import { CodeBlock } from "@/components/ui/codeblock";
import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";

const Message = ({ message }: { message: MessageT }) => {
  const { user } = useAuth();
  const isAssistant = message.role === "assistant";
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    const textToCopy = codeRef.current?.innerText || message.content;
    navigator.clipboard.writeText(textToCopy as string);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={
        !isAssistant
          ? "dark:bg-neutral-950/60 bg-neutral-100/50"
          : "dark:bg-neutral-900 bg-neutral-200/40 last:pb-64 last:sm:pb-44"
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container */}
      <div className="flex w-full max-w-3xl gap-4 px-4 py-10 mx-auto sm:px-8">
        {/* Avatar */}
        <Avatar className="w-8 h-8 border dark:border-neutral-700 border-neutral-400">
        <AvatarImage src={isAssistant ? "" : user?.avatar_url ?? ""} />
          <AvatarFallback>
            {!isAssistant ? (
              <User size={18} />
            ) : (
              <Image src={gptAvatar} alt="GPT Avatar" />
            )}
          </AvatarFallback>
        </Avatar>
        {/* Message */}
        <div className="w-[84%] ml-3">
          {!isAssistant || message.content !== "" ? (
            <MemoizedReactMarkdown
              className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ""}
                      value={String(children).replace(/\n$/, "")}
                      {...props}
                    />
                  );
                },
              }}
            >
              {message.content as string}
            </MemoizedReactMarkdown>
          ) : (
            <span className="py-1 text-sm">Generating answers for you…</span>
          )}
        </div>
        {isAssistant && (
          <div className="flex space-x-2">
            {copied ? (
              <Check
                size="32"
                className={`text-neutral-400 py-2 px-2 hover:text-neutral-200 dark:hover:bg-neutral-800 rounded-md ${
                  isHovered ? "block" : "hidden"
                }`}
              />
            ) : (
              <Clipboard
                size="32"
                className={`text-neutral-400 py-2 px-2 hover:text-neutral-200 dark:hover:bg-neutral-800 rounded-md ${
                  isHovered ? "block" : "hidden"
                }`}
                onClick={handleCopy}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
