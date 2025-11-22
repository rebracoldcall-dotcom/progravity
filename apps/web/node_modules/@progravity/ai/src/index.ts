import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export { OpenAIStream, StreamingTextResponse };
