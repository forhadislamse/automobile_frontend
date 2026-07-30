"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  isLoading: boolean;
  createChat: (title: string) => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: string;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chats from localStorage
  useEffect(() => {
    if (!userId) return;

    const storedChats = localStorage.getItem(`smartautotech_chats_${userId}`);
    if (storedChats) {
      try {
        setChats(JSON.parse(storedChats));
      } catch (error) {
        console.error("Failed to parse stored chats:", error);
      }
    }
  }, [userId]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(
      `smartautotech_chats_${userId}`,
      JSON.stringify(chats),
    );
  }, [chats, userId]);

  const createChat = useCallback(
    (title: string) => {
      const newChat: Chat = {
        id: Date.now().toString(),
        userId: userId || "anonymous",
        title,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
    },
    [userId],
  );

  const selectChat = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setCurrentChat(chat);
      }
    },
    [chats],
  );

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    },
    [currentChat],
  );

  const addMessage = useCallback(
    (message: Message) => {
      if (!currentChat) return;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: [...chat.messages, message],
                updatedAt: Date.now(),
              }
            : chat,
        ),
      );

      setCurrentChat((prev) =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, message],
              updatedAt: Date.now(),
            }
          : null,
      );
    },
    [currentChat],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentChat) return;

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        chatId: currentChat.id,
        role: "user",
        content,
        timestamp: Date.now(),
      };
      addMessage(userMessage);

      setIsLoading(true);
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            chatId: currentChat.id,
            messages: currentChat.messages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId: currentChat.id,
          role: "assistant",
          content: data.response,
          timestamp: Date.now(),
        };
        addMessage(assistantMessage);
      } catch (error) {
        console.error("Chat error:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentChat, addMessage],
  );

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        isLoading,
        createChat,
        selectChat,
        deleteChat,
        addMessage,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
