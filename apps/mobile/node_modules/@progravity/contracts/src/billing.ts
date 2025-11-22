import { z } from "zod";

export const CreateCheckoutSessionSchema = z.object({
    planId: z.string(),
});

export const SubscriptionStatusSchema = z.object({
    status: z.enum(["active", "past_due", "canceled", "incomplete", "trialing"]).nullable(),
    planId: z.string().nullable(),
    isPro: z.boolean(),
});

export type CreateCheckoutSessionInput = z.infer<typeof CreateCheckoutSessionSchema>;
export type SubscriptionStatus = z.infer<typeof SubscriptionStatusSchema>;
