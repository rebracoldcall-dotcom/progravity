import { clerkClient } from "@clerk/nextjs/server";
import { AuthSessionSchema, UserSchema } from "@progravity/contracts";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../init";

export const authRouter = router({
  /**
   * Retrieves the current authenticated session.
   * Throws UNAUTHORIZED if no session exists.
   *
   * @returns {Promise<AuthSession>} The active session details
   * @throws {TRPCError} If user is not authenticated
   */
  getSession: protectedProcedure.query(async ({ ctx }) => {
    const { userId, sessionId } = ctx.auth;

    if (!userId || !sessionId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    return AuthSessionSchema.parse({
      userId,
      sessionId,
      email: user.emailAddresses[0]?.emailAddress || "",
      isAuthenticated: true,
    });
  }),

  /**
   * Retrieves the full profile of the current user.
   * Throws UNAUTHORIZED if no session exists.
   *
   * @returns {Promise<User>} The user profile data
   * @throws {TRPCError} If user is not authenticated
   */
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx.auth;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);

    return UserSchema.parse({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      createdAt: new Date(user.createdAt),
    });
  }),
});
