"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/src/app/libs/auth-context";
import { useChat } from "@/src/app/libs/chat-context";

import { Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ChatSidebarProps {
  onClose?: () => void;
}

export function ChatSidebar({ onClose }: ChatSidebarProps) {
  const { chats, currentChat, createChat, selectChat, deleteChat } = useChat();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleNewChat = () => {
    createChat(`Chat ${Date.now()}`);
    onClose?.();
  };

  return (
    <div className="w-full sm:w-[280px] md:w-[320px] h-full bg-white border-r flex flex-col">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <Image src="/r_logo.png" alt="logo" width={40} height={40} />
          </div>
          <p className="text-sm font-semibold text-gray-700">SmartAutoTech</p>
        </div>

        <Button
          type="button"
          onClick={handleNewChat}
          className="w-full bg-[#042055] text-white hover:bg-[#042055]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 text-sm text-[#042055]"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredChats.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">
              No chats found
            </p>
          ) : (
            filteredChats.map((chat) => {
              const isActive = currentChat?.id === chat.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    selectChat(chat.id);
                    onClose?.();
                  }}
                  className={`p-3 rounded-md cursor-pointer transition group ${
                    isActive
                      ? "bg-blue-100 border-l-4 border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {chat.title || "Untitled Chat"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {chat.messages?.length || 0} messages
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* User Info */}
      <div className="p-3 border-t space-y-3">
        <div className="bg-gray-100 rounded p-3">
          <p className="text-xs font-semibold text-gray-700">
            {user?.name || "Guest"}
          </p>
          <p className="text-xs text-gray-500">{user?.plan || "Free Plan"}</p>
        </div>

        <Button
          type="button"
          onClick={logout}
          className="w-full bg-[#042055] text-white text-xs font-semibold hover:bg-[#042055]/90"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
