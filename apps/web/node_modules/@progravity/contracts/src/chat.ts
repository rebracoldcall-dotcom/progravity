import { z } from "zod";

export const ChatMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
    timestamp: z.date().optional(),
    id: z.string().uuid().optional(),
});

export const ChatMessageInputSchema = z.object({
    message: z.string().min(1).max(4000),
    conversationId: z.string().uuid().optional(),
});

export const ChatHistorySchema = z.object({
    conversationId: z.string().uuid(),
    messages: z.array(ChatMessageSchema),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatMessageInput = z.infer<typeof ChatMessageInputSchema>;
export type ChatHistory = z.infer<typeof ChatHistorySchema>;
