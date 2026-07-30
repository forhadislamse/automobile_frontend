"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@/src/app/libs/chat-context";
import { Plus, Send } from "lucide-react";
import { useState } from "react";
export function InputArea() {
  const { currentChat, sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentChat) return;

    const text = message;
    setMessage("");

    try {
      await sendMessage(text);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(text);
    }
  };

  if (!currentChat) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Create a new chat to get started
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <Button
        type="button"
        size="icon"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        <Plus className="w-5 h-5" />
      </Button>

      <div className="flex-1 flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Enter vehicle details  and describe the issue (include symptoms, when it happens, and any warning signs)..."
          className="min-h-[120px] shadow-md resize-none text-black text-sm"
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !message.trim()}
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-14"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
}
