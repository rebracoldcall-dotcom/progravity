import { clerkClient } from "@clerk/nextjs/server";
import { CreateTeamSchema, InviteMemberSchema, TeamMemberSchema, TeamSchema } from "@progravity/contracts";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../init";

export const teamRouter = router({
    create: protectedProcedure
        .input(CreateTeamSchema)
        .mutation(async ({ ctx, input }) => {
            const clerk = await clerkClient();
            const { userId } = ctx.auth;

            try {
                const organization = await clerk.organizations.createOrganization({
                    name: input.name,
                    slug: input.slug,
                    createdBy: userId,
                });

                return { id: organization.id, slug: organization.slug };
            } catch (error: any) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: error.errors?.[0]?.message || "Failed to create organization",
                });
            }
        }),

    getMembers: protectedProcedure
        .output(z.array(TeamMemberSchema))
        .query(async ({ ctx }) => {
            const { orgId } = ctx.auth;
            if (!orgId) {
                return [];
            }

            const clerk = await clerkClient();
            const memberships = await clerk.organizations.getOrganizationMembershipList({
                organizationId: orgId,
            });

            return memberships.data.map((m) => ({
                id: m.id,
                userId: m.publicUserData?.userId || "",
                email: m.publicUserData?.identifier || "",
                firstName: m.publicUserData?.firstName || null,
                lastName: m.publicUserData?.lastName || null,
                imageUrl: m.publicUserData?.imageUrl || "",
                role: m.role,
            }));
        }),

    inviteMember: protectedProcedure
        .input(InviteMemberSchema)
        .mutation(async ({ ctx, input }) => {
            const { orgId, userId } = ctx.auth;
            if (!orgId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "No active organization",
                });
            }

            const clerk = await clerkClient();

            try {
                await clerk.organizations.createOrganizationInvitation({
                    organizationId: orgId,
                    emailAddress: input.email,
                    role: input.role,
                    inviterUserId: userId,
                });

                return { success: true };
            } catch (error: any) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: error.errors?.[0]?.message || "Failed to invite member",
                });
            }
        }),

    getCurrent: protectedProcedure
        .output(TeamSchema.nullable())
        .query(async ({ ctx }) => {
            const { orgId } = ctx.auth;
            if (!orgId) return null;

            const clerk = await clerkClient();
            const org = await clerk.organizations.getOrganization({ organizationId: orgId });

            return {
                id: org.id,
                name: org.name,
                slug: org.slug || "",
                imageUrl: org.imageUrl,
            };
        }),
});
