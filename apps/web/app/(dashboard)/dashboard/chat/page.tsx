import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat-interface";

export const metadata: Metadata = {
  title: "AI Chat | Progravity",
  description: "Chat with our AI assistant",
};

export default function ChatPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
        </div>
        <div className="h-[calc(100vh-200px)] rounded-md border bg-background shadow-sm">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
