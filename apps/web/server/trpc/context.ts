import { auth } from "@clerk/nextjs/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createTRPCContext(opts?: FetchCreateContextFnOptions) {
  const authObject = await auth();

  return {
    auth: authObject,
    headers: opts?.req.headers,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
