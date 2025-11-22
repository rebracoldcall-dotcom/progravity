import { ChatMessageInputSchema } from "@progravity/contracts";
import { openai, OpenAIStream, StreamingTextResponse } from "@progravity/ai";
import { protectedProcedure, router } from "../init";

export const chatRouter = router({
  // Streaming is handled by /api/chat route handler due to tRPC serialization limitations
  // Future: Add non-streaming procedures here (e.g. getHistory)
  sendMessage: protectedProcedure
    .input(ChatMessageInputSchema)
    .mutation(async () => {
      throw new Error("Use /api/chat for streaming");
    }),
});
