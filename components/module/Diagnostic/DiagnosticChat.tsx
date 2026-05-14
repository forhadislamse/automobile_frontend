"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useGetMySessionsQuery, 
  useGetChatMessagesQuery, 
  useStartNewChatMutation, 
  useSendMessageMutation,
  useUploadImagesMutation 
} from "@/redux/api/aiApi";
import { 
  Search, 
  Plus, 
  Send, 
  Sparkles,
  Image as ImageIcon, 
  Loader2, 
  ChevronLeft 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DiagnosticStep from "./DiagnosticStep";

const DiagnosticChat = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      toast.error(err.data?.message || "Failed to start session.");
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
      toast.error("Failed to send message.");
    }
  };

  const handleOptionSelect = (option: string) => {
    setMessage(option);
  };

  const activeSession = sessions?.find((s: any) => s.id === activeSessionId);

  return (
    <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100">
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className={cn(
          "bg-slate-50/50 border-r border-slate-100 overflow-hidden flex flex-col",
          !isSidebarOpen && "border-none"
        )}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-[14px] uppercase tracking-wider">Investigations</h2>
            <Button variant="ghost" size="icon" onClick={() => setActiveSessionId(null)} className="text-slate-400 hover:text-slate-900">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search history..." 
              className="pl-9 bg-white border-slate-100 rounded-xl focus-visible:ring-slate-900 text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="space-y-1">
            {sessionsLoading ? (
               <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : (
                sessions.map((session: any) => (
                    <div
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "p-4 rounded-xl cursor-pointer transition-all duration-200",
                        activeSessionId === session.id ? "bg-slate-900 text-white shadow-lg shadow-slate-200" : "hover:bg-slate-100 text-slate-600"
                      )}
                    >
                      <div className="font-semibold text-[13px] truncate tracking-tight">{session.title || "New Diagnostic"}</div>
                      <div className="text-[9px] font-medium uppercase tracking-[0.2em] mt-1.5 opacity-50">{new Date(session.updatedAt).toLocaleDateString()}</div>
                    </div>
                ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400">
              <ChevronLeft className={cn("transition-transform", !isSidebarOpen && "rotate-180")} />
            </Button>
            <h3 className="font-medium text-slate-800 text-[14px] uppercase tracking-widest">{activeSession ? activeSession.title : "Active Investigation"}</h3>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {!activeSessionId && !startingChat && (
              <div className="flex flex-col items-center justify-center h-full pt-20 text-center space-y-4">
                <h2 className="text-3xl font-medium text-slate-900 tracking-tight">Diagnostic Engine</h2>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">System Ready // Enforcement Mode</p>
              </div>
            )}

            {messages.map((msg: any, index: number) => (
              <div key={msg.id} className={cn("w-full flex gap-6", msg.role === "user" ? "justify-end" : "justify-start py-2")}>
                {msg.role !== "user" && (
                  <div className="flex-shrink-0 pt-1.5">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                )}
                <div className={cn("max-w-[90%] space-y-1", msg.role === "user" ? "flex flex-col items-end" : "flex-1")}>
                  {msg.role === "user" ? (
                    <div className="bg-slate-800 text-white px-5 py-2.5 rounded-[24px] text-[15px] font-normal shadow-sm">
                      {msg.content}
                      {msg.image && <img src={msg.image} alt="Upload" className="mt-3 rounded-2xl max-h-80 object-cover border border-slate-700" />}
                    </div>
                  ) : (
                    <div className="text-slate-800 w-full">
                      <DiagnosticStep content={msg.content} onOptionSelect={handleOptionSelect} isLatest={index === messages.length - 1} />
                    </div>
                  )}
                  <span className="text-[10px] font-medium text-slate-300 mt-2 block px-2 uppercase tracking-widest">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}

            {sendingMessage && (
              <div className="flex gap-6 py-8 animate-pulse">
                <Sparkles className="w-5 h-5 text-blue-200" />
                <div className="flex-1 space-y-4 pt-1.5">
                  <div className="h-3 w-full bg-slate-50 rounded-full" />
                  <div className="h-3 w-4/5 bg-slate-50 rounded-full" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Pure Gemini Style Pill */}
        <div className="p-6 bg-white border-t border-slate-50">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence>
              {previewUrl && (
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="relative w-24 h-24 rounded-xl overflow-hidden border-4 border-white shadow-xl group mb-4">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="absolute top-1 right-1 bg-rose-500 text-white rounded-full p-1 shadow-lg">
                    <Plus className="w-4 h-4 rotate-45" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[32px] p-2 pr-3 transition-all focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-slate-200/50 focus-within:border-slate-300">
              <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-5 h-5" />
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (activeSessionId ? handleSendMessage() : handleStartChat())}
                placeholder="Enter a prompt here..."
                className="flex-1 h-12 bg-transparent border-none focus-visible:ring-0 text-[16px] font-normal text-slate-700"
              />
              <Button onClick={activeSessionId ? handleSendMessage : handleStartChat} disabled={(uploading || startingChat || sendingMessage) || (!message.trim() && !selectedFile)} className="w-12 h-12 bg-slate-900 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300">
                {(uploading || startingChat || sendingMessage) ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticChat;
