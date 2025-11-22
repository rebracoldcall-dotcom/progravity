import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
    typescript: true,
});

export const PLANS = {
    PRO: {
        id: "pro",
        name: "Pro Plan",
        description: "Unlock AI Chat and advanced features.",
        priceId: process.env.STRIPE_PRICE_ID_PRO || "",
        price: 2000, // $20.00
    },
} as const;

export type PlanId = keyof typeof PLANS;
