import { clerkClient } from "@clerk/nextjs/server";
import { stripe, PLANS } from "@progravity/billing";
import { CreateCheckoutSessionSchema, SubscriptionStatusSchema } from "@progravity/contracts";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../init";

export const billingRouter = router({
    createCheckoutSession: protectedProcedure
        .input(CreateCheckoutSessionSchema)
        .mutation(async ({ ctx, input }) => {
            const { userId } = ctx.auth;
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(userId);
            const email = user.emailAddresses[0]?.emailAddress;

            if (!email) {
                throw new TRPCError({
                    code: "PRECONDITION_FAILED",
                    message: "User must have an email address",
                });
            }

            // Get or create Stripe Customer ID from metadata
            let customerId = user.publicMetadata.stripe?.customerId as string | undefined;

            if (!customerId) {
                const customer = await stripe.customers.create({
                    email,
                    metadata: {
                        userId,
                    },
                });
                customerId = customer.id;

                await clerk.users.updateUser(userId, {
                    publicMetadata: {
                        ...user.publicMetadata,
                        stripe: {
                            ...((user.publicMetadata.stripe as object) || {}),
                            customerId,
                        },
                    },
                });
            }

            // Get Price ID
            const plan = Object.values(PLANS).find((p) => p.id === input.planId);
            if (!plan) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid plan ID",
                });
            }

            // Create Checkout Session
            const session = await stripe.checkout.sessions.create({
                customer: customerId,
                line_items: [
                    {
                        price: plan.priceId,
                        quantity: 1,
                    },
                ],
                mode: "subscription",
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
                metadata: {
                    userId,
                    planId: plan.id,
                },
            });

            if (!session.url) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to create checkout session",
                });
            }

            return { url: session.url };
        }),

    createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
        const { userId } = ctx.auth;
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const customerId = user.publicMetadata.stripe?.customerId as string | undefined;

        if (!customerId) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "No billing account found",
            });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
        });

        return { url: session.url };
    }),

    getSubscriptionStatus: protectedProcedure
        .output(SubscriptionStatusSchema)
        .query(async ({ ctx }) => {
            const { userId } = ctx.auth;
            const clerk = await clerkClient();
            const user = await clerk.users.getUser(userId);
            const stripeData = user.publicMetadata.stripe as any;

            return {
                status: stripeData?.status || null,
                planId: stripeData?.planId || null,
                isPro: stripeData?.status === "active",
            };
        }),
});
