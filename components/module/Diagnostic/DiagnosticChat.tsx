"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetMySessionsQuery, 
  useGetChatMessagesQuery, 
  useStartNewChatMutation, 
  useSendMessageMutation,
  useUploadImagesMutation 
} from "@/redux/api/aiApi";
import { Search, Plus, Send, Image as ImageIcon, Loader2, User, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

const formatPersonaName = (persona: string) => {
  if (!persona) return "";
  return persona
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('Gpt', 'AI');
};

const DiagnosticChat = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Queries & Mutations
  const { data: sessionsRes, isLoading: sessionsLoading } = useGetMySessionsQuery(searchTerm);
  const { data: messagesRes, isLoading: messagesLoading } = useGetChatMessagesQuery(activeSessionId as string, {
    skip: !activeSessionId,
  });

  const sessions = (sessionsRes as any)?.data || [];
  const messages = (messagesRes as any)?.data || [];

  const [startChat, { isLoading: startingChat }] = useStartNewChatMutation();
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadAndGetUrl = async () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("images", selectedFile);
    const res = await uploadImages(formData).unwrap() as any;
    return res.data[0]; 
  };

  const handleStartChat = async () => {
    if (!message.trim() && !selectedFile) return;
    try {
      const imageUrl = await uploadAndGetUrl();
      const res = await startChat({
        persona: "shop_foreman_gpt",
        prompt: message,
        image: imageUrl || undefined,
      }).unwrap() as any;
      setActiveSessionId(res.data.session.id);
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      const errorMessage = err.data?.message || "Failed to start diagnostic session. Please check your subscription.";
      toast.error(errorMessage, {
        duration: 5000,
      });
      console.error("Failed to start chat:", err);
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !activeSessionId) return;
    try {
      const imageUrl = await uploadAndGetUrl();
      await sendMessage({
        sessionId: activeSessionId,
        prompt: message,
        image: imageUrl || undefined,
      }).unwrap();
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      const errorMessage = err.data?.message || "Failed to send message.";
      toast.error(errorMessage);
      console.error("Failed to send message:", err);
    }
  };

  const activeSession = sessions?.find((s: any) => s.id === activeSessionId);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100">
      {/* Sidebar - Chat History */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className={cn(
          "bg-blue-50/50 border-r border-blue-100 overflow-hidden flex flex-col",
          !isSidebarOpen && "border-none"
        )}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-blue-900 text-lg">Diagnostics</h2>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                    setActiveSessionId(null);
                    setMessage("");
                }}
                className="text-blue-600 hover:bg-blue-100"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
            <Input 
              placeholder="Search chats..." 
              className="pl-10 bg-white border-blue-100 focus-visible:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {sessionsLoading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-400" /></div>
            ) : (
                sessions.map((session: any) => (
                    <motion.div
                      key={session.id}
                      whileHover={{ x: 4 }}
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "p-3 rounded-xl cursor-pointer transition-all duration-200 group relative",
                        activeSessionId === session.id 
                          ? "bg-blue-600 text-white shadow-lg" 
                          : "hover:bg-blue-100 text-blue-700"
                      )}
                    >
                      <div className="font-medium text-sm truncate pr-2">
                        {session.title || "New Investigation"}
                      </div>
                      <div className={cn(
                        "text-[10px] opacity-70",
                        activeSessionId === session.id ? "text-blue-100" : "text-blue-400"
                      )}>
                        {new Date(session.updatedAt).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-blue-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <Button 
               variant="ghost" 
               size="icon" 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="text-blue-400"
             >
                <ChevronLeft className={cn("transition-transform", !isSidebarOpen && "rotate-180")} />
             </Button>
             <div>
                <h3 className="font-semibold text-blue-900">
                    {activeSession ? activeSession.title : "New Diagnostic Session"}
                </h3>
             </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {!activeSessionId && !startingChat && (
                <div className="flex flex-col items-center justify-center h-full pt-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 animate-pulse">
                        <Plus className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-blue-900">What can I help with?</h2>
                        <p className="text-blue-400 mt-2">Enter vehicle data and describe the issue to start a new diagnostic.</p>
                    </div>
                </div>
            )}

            {(messagesLoading || startingChat) ? (
                <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-blue-400 w-8 h-8" /></div>
            ) : (
                messages.map((msg: any) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={cn(
                        "flex gap-4 group",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <Avatar className={cn(
                        "w-10 h-10 border-2",
                        msg.role === "user" ? "border-blue-200" : "border-emerald-200"
                      )}>
                        <AvatarFallback className={msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}>
                          {msg.role === "user" ? <User className="w-5 h-5" /> : "AI"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={cn(
                        "max-w-[80%] space-y-2",
                        msg.role === "user" ? "items-end" : "items-start"
                      )}>
                        <Card className={cn(
                          "p-4 rounded-2xl border-none shadow-sm",
                          msg.role === "user" 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
                        )}>
                          <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white">
                            <ReactMarkdown>
                                {msg.content}
                            </ReactMarkdown>
                          </div>
                          {msg.image && (
                            <img 
                              src={msg.image} 
                              alt="Diagnostic Attachment" 
                              className="mt-3 rounded-lg max-h-60 w-full object-cover border border-white/20"
                            />
                          )}
                        </Card>
                        <span className="text-[10px] text-gray-400 px-2">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                ))
            )}
            {sendingMessage && (
                <div className="flex gap-4 animate-pulse">
                    <Avatar className="w-10 h-10"><AvatarFallback>AI</AvatarFallback></Avatar>
                    <div className="bg-gray-100 h-12 w-48 rounded-2xl rounded-tl-none" />
                </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-blue-50">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {/* Image Preview Bubble */}
            <AnimatePresence>
                {previewUrl && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-200 group mb-2"
                    >
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Plus className="w-3 h-3 rotate-45" />
                        </button>
                        {uploading && (
                            <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-3">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                <div className="flex-1 relative flex items-center">
                <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (activeSessionId ? handleSendMessage() : handleStartChat())}
                    placeholder="Describe vehicle issues, symptoms, or error codes..."
                    className="pr-24 py-6 bg-gray-50 border-blue-100 rounded-2xl focus-visible:ring-blue-400"
                />
                <div className="absolute right-2 flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => fileInputRef.current?.click()}
                        className={cn("text-blue-400 hover:text-blue-600 h-8 w-8", selectedFile && "text-blue-600 bg-blue-50")}
                    >
                    <ImageIcon className="w-5 h-5" />
                    </Button>
                    <Button 
                    onClick={activeSessionId ? handleSendMessage : handleStartChat}
                    disabled={(uploading || startingChat || sendingMessage) || (!message.trim() && !selectedFile)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 h-9 shadow-inner"
                    >
                        {(uploading || startingChat || sendingMessage) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
                </div>
            </div>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">
            AI can make mistakes. Always verify critical diagnostic steps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticChat;
