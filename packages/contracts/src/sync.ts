import { z } from "zod";

export const PushRequestSchema = z.object({
    clientID: z.string(),
    mutations: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            args: z.any(),
        })
    ),
});

export const PullRequestSchema = z.object({
    clientID: z.string(),
    cookie: z.number().nullable(),
});

export const PullResponseSchema = z.object({
    cookie: z.number(),
    lastMutationID: z.number(),
    patch: z.array(
        z.object({
            op: z.enum(["put", "del"]),
            key: z.string(),
            value: z.any().optional(),
        })
    ),
});

export type PushRequest = z.infer<typeof PushRequestSchema>;
export type PullRequest = z.infer<typeof PullRequestSchema>;
export type PullResponse = z.infer<typeof PullResponseSchema>;
