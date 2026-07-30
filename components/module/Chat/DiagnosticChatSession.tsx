/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useGetChatMessagesQuery,
  useGetMySessionsQuery,
  useSendMessageMutation,
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
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import ChatSkeleton from "./ChatSkeleton";

// Diagnostic JSON helpers

interface DiagnosticStep {
  vehicle: string;
  concern: string;
  system_focus: string;
  current_assessment: string;
  step_number: number;
  step_title: string;
  instruction: string;
  what_to_check: string;
  response_options: string[];
  state_action: string;
}

function parseDiagnosticJson(content: string): DiagnosticStep | null {
  try {
    const trimmed = content.trim();
    if (!trimmed.startsWith("{")) return null;
    const parsed = JSON.parse(trimmed);
    if (
      typeof parsed.step_number === "number" &&
      Array.isArray(parsed.response_options)
    ) {
      return parsed as DiagnosticStep;
    }
    return null;
  } catch {
    return null;
  }
}

// Invalid Input Response

interface InvalidInputResponse {
  accepted: false;
  status: "INVALID_INPUT";
  reason: string;
  message: string;
  expected_response_options: string[];
  current_step: number;
}

function parseInvalidInputJson(content: string): InvalidInputResponse | null {
  try {
    const trimmed = content.trim();
    if (!trimmed.startsWith("{")) return null;
    const parsed = JSON.parse(trimmed);
    if (
      parsed.accepted === false &&
      parsed.status === "INVALID_INPUT" &&
      Array.isArray(parsed.expected_response_options)
    ) {
      return parsed as InvalidInputResponse;
    }
    return null;
  } catch {
    return null;
  }
}

interface InvalidInputCardProps {
  data: InvalidInputResponse;
  onOptionSelect: (option: string) => void;
}

const InvalidInputCard: React.FC<InvalidInputCardProps> = ({
  data,
  onOptionSelect,
}) => {
  return (
    <div className="w-full container mx-auto rounded-xl overflow-hidden border border-amber-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-black leading-none">
            !
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-800 font-semibold text-sm leading-tight">
            Invalid Response
          </p>
          <p className="text-amber-500 text-[11px] mt-0.5">
            Step {data.current_step} &middot; {data.reason}
          </p>
        </div>
      </div>

      {/* Message */}
      <div className="px-4 py-3">
        <p className="text-[13px] text-gray-700 leading-relaxed">
          {data.message}
        </p>
      </div>

      {/* Expected Options */}
      <div className="px-4 pb-4 pt-1 border-t border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
          Please select one of these
        </p>
        <div className="flex flex-col gap-1.5">
          {data.expected_response_options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOptionSelect(option)}
              className="text-left text-[13px] rounded-lg px-3 py-2 transition-all duration-150 border text-gray-700 bg-gray-50 hover:bg-[#042055] hover:text-white border-gray-200 hover:border-[#042055] cursor-pointer"
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Generic State Action Response

interface ActionResponse {
  state_action: "awaiting_response" | "confirm_switch" | "final_conclusion";
  message: string;
}

function parseActionJson(content: string): ActionResponse | null {
  try {
    const trimmed = content.trim();
    if (!trimmed.startsWith("{")) return null;
    const parsed = JSON.parse(trimmed);
    if (
      parsed.state_action &&
      ["awaiting_response", "confirm_switch", "final_conclusion"].includes(
        parsed.state_action,
      ) &&
      parsed.message
    ) {
      return parsed as ActionResponse;
    }
    return null;
  } catch {
    return null;
  }
}

const ActionCard: React.FC<{
  data: ActionResponse;
  onOptionSelect: (option: string) => void;
}> = ({ data, onOptionSelect }) => {
  const getColors = () => {
    switch (data.state_action) {
      case "confirm_switch":
        return "border-blue-100 bg-blue-50/50 text-blue-900";
      case "final_conclusion":
        return "border-emerald-100 bg-emerald-50/50 text-emerald-900";
      default:
        return "border-gray-200 bg-gray-50/50 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "w-full container mx-auto p-4 rounded-xl border shadow-sm",
        getColors(),
      )}
    >
      <div className="space-y-3">
        <p className="text-[13px] leading-relaxed font-medium">
          {data.message}
        </p>

        {data.state_action === "confirm_switch" && (
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => onOptionSelect("Switch")}
              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Switch
            </button>
            <button
              onClick={() => onOptionSelect("Continue")}
              className="px-4 py-1.5 bg-white text-blue-600 border border-blue-200 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DiagnosticMessageCardProps {
  data: DiagnosticStep;
  /** The option the user already picked (from the next user message). Undefined if not yet answered. */
  selectedOption?: string;
  /** True = this is the latest step, buttons are clickable */
  isActive: boolean;
  onOptionSelect: (option: string) => void;
}

const DiagnosticMessageCard: React.FC<DiagnosticMessageCardProps> = ({
  data,
  selectedOption,
  isActive,
  onOptionSelect,
}) => {
  return (
    <div className="w-full container mx-auto rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="bg-[#042055] px-4 py-2.5 flex items-center gap-3">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs shrink-0">
          {data.step_number}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-tight truncate">
            {data.step_title}
          </p>
          <p className="text-blue-300 text-[11px] mt-0.5">
            {data.system_focus} &middot; Step {data.step_number}
          </p>
        </div>
        {selectedOption && (
          <span className="text-[10px] font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
            Answered
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* Assessment */}
        <div className="border-l-2 border-gray-200 pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            Assessment
          </p>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            {data.current_assessment}
          </p>
        </div>

        {/* Instruction */}
        <div className="border-l-2 border-[#042055]/30 pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            Instruction
          </p>
          <p className="text-[13px] text-gray-800 leading-relaxed">
            {data.instruction}
          </p>
        </div>

        {/* What to check */}
        <div className="border-l-2 border-gray-200 pl-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            What to check
          </p>
          <p className="text-[13px] text-gray-600 leading-relaxed">
            {data.what_to_check}
          </p>
        </div>
      </div>

      {/* Response Options */}
      {data.state_action !== "final_conclusion" &&
        data.step_title !== "Plan Restriction" &&
        data.step_title !== "Intake Completion" &&
        !(
          data.step_title === "Initial Intake" &&
          data.state_action === "awaiting_response"
        ) && (
          <div className="px-4 pb-4 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              {isActive ? "Select your response" : "Response options"}
            </p>
            <div className="flex flex-col gap-1.5">
              {data.response_options.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <motion.button
                    key={idx}
                    whileHover={isActive ? { x: 3 } : {}}
                    whileTap={isActive ? { scale: 0.98 } : {}}
                    onClick={() => isActive && onOptionSelect(option)}
                    disabled={!isActive}
                    className={cn(
                      "text-left text-[13px] rounded-lg px-3 py-2 transition-all duration-150 border flex items-center justify-between gap-2",
                      isSelected
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                        : isActive
                          ? "text-gray-700 bg-gray-50 hover:bg-[#042055] hover:text-white border-gray-200 hover:border-[#042055] cursor-pointer"
                          : "text-gray-300 bg-white border-gray-100 cursor-not-allowed",
                    )}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <span className="text-emerald-500 text-[10px] font-semibold shrink-0">
                        Selected
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
    </div>
  );
};

const DiagnosticChatSession = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const chatId = useParams().chatId as string;
  const sessionId = chatId;

  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: sessionsRes, isLoading: sessionsLoading } =
    useGetMySessionsQuery(searchTerm);

  const { data: messagesRes, isLoading: messagesLoading } =
    useGetChatMessagesQuery(sessionId);

  const { data: getMe } = useGetMeQuery({}) as any;

  const sessions = (sessionsRes as any)?.data || [];
  const messages = (messagesRes as any)?.data || [];

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [uploadImages, { isLoading: uploading }] = useUploadImagesMutation();

  const user = getMe?.data;

  const activeSession = sessions?.find((s: any) => s.id === sessionId);

  // Build display name and initials
  const displayName =
    user?.name || user?.fullName || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingMessage]);

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
    const res = (await uploadImages(formData).unwrap()) as any;
    return res.data[0];
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !selectedFile) return;
    try {
      const imageUrl = await uploadAndGetUrl();
      await sendMessage({
        sessionId,
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

  // Used by DiagnosticMessageCard option buttons to send a pre-defined text
  const handleSendMessageWithText = async (text: string) => {
    if (!text.trim()) return;
    try {
      await sendMessage({
        sessionId,
        prompt: text,
        image: undefined,
      }).unwrap();
    } catch (err: any) {
      const errorMessage = err.data?.message || "Failed to send message.";
      toast.error(errorMessage);
      console.error("Failed to send message:", err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.reload();
    // router.push("/");
  };

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
        {/* Sidebar Top */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-start gap-2">
            <Image
              src="/r_logo.png"
              alt="SmartAutoTech Logo"
              width={200}
              height={200}
              className="h-16 w-16"
            />
            <h2 className="font-bold text-[#111827] text-[18px]">
              SmartAutoTech
            </h2>
          </div>
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/chat")}
              className="bg-[#042055] text-white w-full gap-2"
            >
              <Plus className="w-5 h-5" /> New Chat
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4B5563]" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-white border-blue-100 focus-visible:ring-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Session List */}
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
                  className={cn(
                    "p-1 rounded-xl cursor-pointer transition-all duration-200 group relative",
                    sessionId === session.id
                      ? "bg-[#042055] text-white shadow-lg"
                      : "hover:bg-[#b9b9b9] ps-3 text-[#4B5563]",
                  )}
                >
                  <div className="font-medium text-sm truncate pr-2">
                    {session.title || "New Investigation"}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Footer — User Profile */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            {/* Avatar */}
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

            {/* User Info */}
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {displayName}
              </p>

              {displayEmail && (
                <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
              )}

              <p className="text-[11px] font-medium text-blue-600 mt-1">
                {user?.plan?.name || "No Plan"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link href="/chat/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Profile"
                  className="text-gray-500 hover:text-gray-600 hover:bg-blue-50 rounded-md"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                title="Logout"
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
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
              <ChevronLeft
                className={cn(
                  "transition-transform",
                  !isSidebarOpen && "rotate-180",
                )}
              />
            </Button>
            <div>
              <h3 className="font-semibold text-[#042055]">
                {activeSession?.title || "Diagnostic Session"}
              </h3>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {messagesLoading ? (
              <div className="flex justify-center pt-10">
                <ChatSkeleton />
              </div>
            ) : (
              messages.map((msg: any, msgIndex: number) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={cn(
                    "flex gap-4 group",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 border-2",
                      msg.role === "user" ? "" : "",
                    )}
                  >
                    <div
                      className={
                        msg.role === "user"
                          ? ""
                          : "bg-white text-[#4B5563] border-none"
                      }
                    >
                      {msg.role === "user" ? (
                        <Image
                          src="/images/mechanic_chatbot_icon.png"
                          alt="logo"
                          width={100}
                          height={100}
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <Image
                          src="/images/ai_chatbot_icon.png"
                          alt="logo"
                          width={100}
                          height={100}
                          className="w-14 h-14 object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "max-w-[80%] space-y-2",
                      msg.role === "user" ? "items-end" : "items-start",
                    )}
                  >
                    {(() => {
                      if (msg.role === "assistant") {
                        const diagnostic = parseDiagnosticJson(msg.content);
                        if (diagnostic) {
                          // Find the next user message to know which option was selected
                          const nextUserMsg = messages
                            .slice(msgIndex + 1)
                            .find((m: any) => m.role === "user");
                          const selectedOption: string | undefined =
                            nextUserMsg?.content;
                          return (
                            <DiagnosticMessageCard
                              data={diagnostic}
                              selectedOption={selectedOption}
                              isActive={!selectedOption}
                              onOptionSelect={(option) => {
                                handleSendMessageWithText(option);
                              }}
                            />
                          );
                        }
                        // Check for INVALID_INPUT response
                        const invalidInput = parseInvalidInputJson(msg.content);
                        if (invalidInput) {
                          return (
                            <InvalidInputCard
                              data={invalidInput}
                              onOptionSelect={(option) => {
                                handleSendMessageWithText(option);
                              }}
                            />
                          );
                        }

                        // Check for Generic Action response
                        const actionResponse = parseActionJson(msg.content);
                        if (actionResponse) {
                          return (
                            <ActionCard
                              data={actionResponse}
                              onOptionSelect={(option) => {
                                handleSendMessageWithText(option);
                              }}
                            />
                          );
                        }
                      }
                      return (
                        <Card
                          className={cn(
                            "p-4 rounded-2xl border-none shadow-sm",
                            msg.role === "user"
                              ? "bg-[#042055] text-white rounded-tr-none"
                              : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100",
                          )}
                        >
                          <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-800 prose-pre:text-white">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                          {msg.image && (
                            <Image
                              src={msg.image}
                              alt="Diagnostic Attachment"
                              width={400}
                              height={240}
                              className="mt-3 rounded-lg max-h-60 w-full object-cover border border-white/20"
                            />
                          )}
                        </Card>
                      );
                    })()}
                    <span className="text-[10px] text-gray-400 px-2">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}

            {sendingMessage && (
              <div className="flex gap-4 animate-pulse">
                {/* <Avatar className="w-10 h-10">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar> */}
                <Image
                  src="/images/ai_chatbot_icon.png"
                  alt="SmartAuto Logo"
                  width={500}
                  height={500}
                  className="w-10 h-10"
                />
                <div className="bg-gray-100 h-12 w-48 rounded-2xl rounded-tl-none" />
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-blue-50">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <AnimatePresence>
              {previewUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-blue-200 group mb-2"
                >
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-black animate-spin" />
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
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();

                      if (!message.trim()) return;

                      handleSendMessage();
                    }
                  }}
                  placeholder="Enter Vehicle information: Year / make / model / Engine / Concern"
                  className="pl-12 pr-24 py-6 bg-gray-50 text-black border-blue-100 rounded-2xl focus-visible:ring-blue-400"
                />
                <div className="absolute left-2 flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "text-[#042055] hover:text-primary h-8 w-8",
                      selectedFile && "text-primary bg-blue-50",
                    )}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                </div>
                <div className="absolute right-2 flex items-center pe-5 gap-1">
                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      uploading ||
                      sendingMessage ||
                      (!message.trim() && !selectedFile)
                    }
                    className="bg-[#042055] hover:bg-[#042055] text-white rounded-xl px-4 h-9 shadow-inner"
                  >
                    {uploading || sendingMessage ? (
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

export default DiagnosticChatSession;

