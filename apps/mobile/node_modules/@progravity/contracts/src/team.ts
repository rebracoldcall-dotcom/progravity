import { z } from "zod";

export const CreateTeamSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase, numbers, and dashes only"),
});

export const InviteMemberSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["org:admin", "org:member"]),
});

export const TeamMemberSchema = z.object({
    id: z.string(),
    userId: z.string(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    imageUrl: z.string(),
    role: z.string(),
});

export const TeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    imageUrl: z.string(),
});

export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type InviteMemberInput = z.infer<typeof InviteMemberSchema>;
export type TeamMember = z.infer<typeof TeamMemberSchema>;
export type Team = z.infer<typeof TeamSchema>;
