/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useGetMySessionsQuery,
  useStartNewChatMutation,
  useUploadImagesMutation,
} from "@/redux/api/aiApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Edit,
  ImageIcon,
  Loader2,
  LogOut,
  Plus,
  Search,
  Send,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface DiagnosticChatHomeProps {
  onSessionStart?: (sessionId: string) => void;
  onLogout?: () => void;
}


const LOADING_STEPS = [
  "Reading vehicle data",
  "Scanning diagnostic codes",
  "Consulting repair database",
  "Analyzing fault patterns",
  "Generating recommendations",
];


function DiagnosticLoadingOverlay({ prompt }: { prompt: string }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      key="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white px-6"
    >
      {/* Single clean spinner */}
      <div className="relative w-14 h-14 mb-7">
        <div className="absolute inset-0 rounded-full border-[2px] border-gray-100" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-[#042055]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#042055]" />
        </div>
      </div>

      {/* Current step */}
      <AnimatePresence mode="wait">
        <motion.p
          key={stepIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-[#042055] font-medium text-[15px] text-center"
        >
          {LOADING_STEPS[stepIndex]}…
        </motion.p>
      </AnimatePresence>

      {/* Prompt snippet */}
      {prompt && (
        <p className="text-[13px] text-gray-400 text-center mt-1.5 max-w-[260px] truncate">
          {prompt.length > 55 ? prompt.slice(0, 55) + "…" : prompt}
        </p>
      )}

      {/* Progress pills */}
      <div className="flex gap-1.5 mt-7">
        {LOADING_STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i === stepIndex ? 18 : 6,
              opacity: i === stepIndex ? 1 : 0.2,
            }}
            transition={{ duration: 0.3 }}
            className="h-1.5 rounded-full bg-[#042055]"
          />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
const DiagnosticChatHome = ({ onSessionStart }: DiagnosticChatHomeProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [animation, setAnimation] = useState(null);
  const [message, setMessage] = useState("");
  const [pendingPrompt, setPendingPrompt] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: sessionsRes, isLoading: sessionsLoading } =
    useGetMySessionsQuery(searchTerm);
  const sessions = (sessionsRes as any)?.data || [];

  const { data: getMe } = useGetMeQuery({}) as any;
  const [startChat, { isLoading: startingChat }] = useStartNewChatMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const user = getMe?.data;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetch("/lottie/Smooth gears _ Ignite Animation.json")
      .then((res) => res.json())
      .then(setAnimation);
  }, []);

  if (!animation) return null;

  const uploadAndGetUrl = async () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("images", selectedFile);
    const res = (await uploadImages(formData).unwrap()) as any;
    return res.data[0];
  };

  const handleStartChat = async () => {
    if (!message.trim() && !selectedFile) return;
    try {
      const imageUrl = await uploadAndGetUrl();
      const capturedPrompt = message;
      setPendingPrompt(capturedPrompt);
      setMessage("");
      setSelectedFile(null);
      setPreviewUrl(null);

      const res = (await startChat({
        persona: "shop_foreman_gpt",
        prompt: capturedPrompt,
        image: imageUrl || undefined,
      }).unwrap()) as any;

      const newSessionId = res.data.session.id;
      if (onSessionStart) {
        onSessionStart(newSessionId);
      } else {
        router.push(`/chat/${newSessionId}`);
      }
    } catch (err: any) {
      setPendingPrompt("");
      const errorMessage =
        err.data?.message ||
        "Failed to start diagnostic session. Please check your subscription.";
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    router.push("/");
  };

  const displayName =
    user?.name || user?.fullName || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isProcessing = uploading || startingChat;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white rounded-2xl shadow-xl border border-blue-100">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? 320 : 0 }}
        className={cn(
          "bg-[#f7f9fa] border-r border-blue-100 overflow-hidden flex flex-col",
          !isSidebarOpen && "border-none",
        )}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-start gap-2">
            <Link href="/">
              <Image
                src="/r_logo.png"
                alt="SmartAutoTech Logo"
                width={200}
                height={200}
                className="h-16 w-16"
              />
            </Link>
            <h2 className="font-bold text-[#111827] text-[18px]">
              SmartAutoTech
            </h2>
          </div>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setMessage("");
                setSelectedFile(null);
                setPreviewUrl(null);
                setPendingPrompt("");
              }}
              className="bg-[#042055] text-white w-full gap-2"
            >
              <Plus className="w-5 h-5" /> New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-white border-blue-100 text-black focus-visible:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto">
          <div className="space-y-2">
            {sessionsLoading ? (
              <div className="flex justify-center p-4">
                <Loading />
              </div>
            ) : (
              sessions.map((session: any) => (
                <motion.div
                  key={session.id}
                  whileHover={{ x: 4 }}
                  onClick={() => router.push(`/chat/${session.id}`)}
                  className="p-1 rounded-xl cursor-pointer transition-all duration-200 group relative hover:bg-[#b9b9b9] ps-3 text-[#4B5563]"
                >
                  <div className="font-medium text-sm truncate pr-2">
                    {session.title || "New Investigation"}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#042055] text-white flex items-center justify-center text-sm font-semibold">
                  {initials || <User className="w-4 h-4" />}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
              )}
              <p className="text-[11px] font-medium text-blue-600 mt-1">
                {user?.plan?.name || "No Plan"}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/chat/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Profile"
                  aria-label="Go to profile"
                  className="text-gray-500 hover:text-gray-600 hover:bg-blue-50 rounded-md"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                title="Logout"
                aria-label="Logout"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-white min-h-0">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-blue-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-400 shrink-0"
            >
              <ChevronLeft
                className={cn("transition-transform", !isSidebarOpen && "rotate-180")}
              />
            </Button>
            <h3 className="font-semibold text-blue-900 text-sm sm:text-base truncate">
              {isProcessing ? "Analyzing…" : "New Diagnostic Session"}
            </h3>
          </div>
        </div>

        {/* Hero + Overlay */}
        <div className="flex-1 flex flex-col items-center mt-12 justify-center p-4 sm:p-6 overflow-y-auto relative">
          <AnimatePresence>
            {isProcessing && <DiagnosticLoadingOverlay prompt={pendingPrompt} />}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center space-y-3 sm:space-y-4 mb-6 sm:mb-10"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
              <Image
                src="/r_logo.png"
                alt="SmartAutoTech Logo"
                width={200}
                height={200}
                className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-[#111827]">
              What can I help with?
            </h2>
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white border-t border-blue-50">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <AnimatePresence>
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-blue-200 group mb-2"
                >
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  <button
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
                      <Loading />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <div className="flex-1 relative flex items-center min-w-0">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isProcessing) handleStartChat();
                    }
                  }}
                  disabled={isProcessing}
                  placeholder="Enter Vehicle information: Year / make / model / Engine / Concern"
                  className="pl-10 sm:pl-12 pr-20 sm:pr-24 py-4 sm:py-6 text-sm sm:text-base bg-gray-50 text-black border-blue-100 rounded-2xl focus-visible:ring-blue-400 disabled:opacity-50"
                />
                <div className="absolute left-2 flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className={cn(
                      "text-[#042055] hover:text-primary h-7 w-7 sm:h-8 sm:w-8",
                      selectedFile && "text-primary bg-blue-50",
                    )}
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                <div className="absolute right-2 flex items-center gap-1">
                  <Button
                    onClick={handleStartChat}
                    disabled={isProcessing || (!message.trim() && !selectedFile)}
                    className="bg-[#042055] hover:bg-[#042055af] text-white rounded-xl px-3 sm:px-4 h-8 sm:h-9 text-sm shadow-inner"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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

export default DiagnosticChatHome;