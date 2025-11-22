import { TRPCError } from "@trpc/server";

interface RateLimitStore {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
    uniqueTokenPerInterval: number;
    interval: number;
}

export async function rateLimit(
    identifier: string,
    options: RateLimitOptions = { uniqueTokenPerInterval: 100, interval: 60000 }
): Promise<void> {
    const now = Date.now();
    const tokenData = store.get(identifier);

    if (!tokenData || now > tokenData.resetTime) {
        // Reset or create new entry
        store.set(identifier, {
            count: 1,
            resetTime: now + options.interval,
        });
        return;
    }

    if (tokenData.count >= options.uniqueTokenPerInterval) {
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Rate limit exceeded. Please try again later.",
        });
    }

    tokenData.count += 1;
}
