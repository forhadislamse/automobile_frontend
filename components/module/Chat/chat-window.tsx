"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/src/app/libs/chat-context";

import { Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import AiIcon from "./AiIcon";
import { InputArea } from "./input-area";
import { MessageBubble } from "./message-bubble";

export function ChatWindow() {
  const { currentChat, isLoading } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  // No chat selected
  if (!currentChat) {
    return (
      <div className="relative flex flex-col items-center justify-center h-full overflow-hidden px-4">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/Lo.png')" }}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-center space-y-4 max-w-md">
          <div className="flex justify-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl md:text-[32px] font-bold text-[#111827]">
              What can I help with?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Create a new chat to get started with vehicle diagnostics
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = currentChat.messages.length === 0;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/Lo.png')" }}
      />
      <div className="absolute inset-0 bg-white backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Messages */}
        {!isEmpty && (
          <ScrollArea className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-full max-w-2xl mx-auto space-y-4">
              {currentChat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-lg px-4 py-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <AiIcon />
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#4d4d4d] mb-6">
              What can I help with?
            </h3>

            <div className="w-full max-w-2xl">
              <InputArea />
            </div>
          </div>
        )}

        {/* Bottom Input */}
        {!isEmpty && (
          <div className="border-t border-border bg-white/90 backdrop-blur px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="w-full max-w-2xl mx-auto">
              <InputArea />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
