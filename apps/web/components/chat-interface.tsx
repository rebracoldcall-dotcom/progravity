"use client";

import { useState } from "react";
import { MessageInput } from "@/components/message-input";
import { MessageList } from "@/components/message-list";
import { TypingIndicator } from "@/components/typing-indicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const stream = response.body;
      if (!stream) throw new Error("No stream");

      const assistantMessageId = crypto.randomUUID();
      setMessages((prev) => [...prev, { id: assistantMessageId, role: "assistant", content: "" }]);

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // TODO: Show toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MessageList messages={messages} isLoading={isLoading} />
      {isLoading && (
        <div className="px-4 py-2">
          <TypingIndicator />
        </div>
      )}
      <div className="p-4 border-t">
        <MessageInput value={input} onChange={setInput} onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
