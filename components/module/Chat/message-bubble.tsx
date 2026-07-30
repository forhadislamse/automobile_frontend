/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Message } from "@/src/app/libs/chat-context";
import { useEffect, useState } from "react";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    // Parse the content for formatting
    let parsed = message.content;

    // Replace patterns with HTML-like formatting
    parsed = parsed
      .replace(/⚠️\s+Possible Causes:/g, "⚠️ Possible Causes:")
      .replace(/✓\s+/g, "✓ ")
      .replace(/🔧\s+Step/g, "🔧 Step")
      .replace(/🛠️\s+Recommended/g, "🛠️ Recommended")
      .replace(/(\d+️⃣)/g, "$1 ");

    setFormattedContent(parsed);
  }, [message.content]);

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-xs lg:max-w-md bg-primary text-primary-foreground rounded-lg px-4 py-2">
          <p className="text-sm whitespace-pre-wrap break-words">
            {formattedContent}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-xs lg:max-w-md bg-card border border-border rounded-lg px-4 py-3">
        <div className="text-sm text-card-foreground whitespace-pre-wrap break-words space-y-2">
          {formattedContent.split("\n").map((line, idx) => {
            // Check if line contains special formatting
            if (
              line.includes("⚠️") ||
              line.includes("🔧") ||
              line.includes("🛠️") ||
              line.includes("→")
            ) {
              return (
                <div key={idx} className="font-semibold text-foreground">
                  {line}
                </div>
              );
            }

            if (line.includes("✓") || line.match(/^\d+️⃣/)) {
              return (
                <div key={idx} className="ml-3 text-muted-foreground">
                  {line}
                </div>
              );
            }

            if (line.trim() === "") {
              return <div key={idx} className="h-1" />;
            }

            return <p key={idx}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}
