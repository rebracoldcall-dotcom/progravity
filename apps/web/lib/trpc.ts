import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/trpc";

// Clerk auth types are not portable but this is safe for internal use
export const trpc = createTRPCReact<AppRouter>();
