import { OpenAIStream, StreamingTextResponse, openai } from "@progravity/ai";
import { ChatMessageInputSchema } from "@progravity/contracts";
import { auth } from "@clerk/nextjs/server";

export const runtime = "edge";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const result = ChatMessageInputSchema.safeParse(json);

    if (!result.success) {
        return new Response("Invalid input", { status: 400 });
    }

    const { message } = result.data;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        stream: true,
        messages: [
            { role: "user", content: message },
        ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);
}
