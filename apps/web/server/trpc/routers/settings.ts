import { clerkClient } from "@clerk/nextjs/server";
import { FeatureFlagsSchema, UpdateProfileSchema, UserSchema } from "@progravity/contracts";
import { getFeatureFlags } from "@progravity/feature-flags";
import { protectedProcedure, publicProcedure, router } from "../init";

export const settingsRouter = router({
    getFeatureFlags: publicProcedure
        .output(FeatureFlagsSchema)
        .query(() => {
            return getFeatureFlags();
        }),

    updateProfile: protectedProcedure
        .input(UpdateProfileSchema)
        .output(UserSchema)
        .mutation(async ({ ctx, input }) => {
            const clerk = await clerkClient();

            const user = await clerk.users.updateUser(ctx.auth.userId, {
                firstName: input.firstName,
                lastName: input.lastName,
            });

            return {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || "",
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
                createdAt: new Date(user.createdAt),
            };
        }),
});
