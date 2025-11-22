import { z } from "zod";

export const FeatureFlagsSchema = z.record(z.boolean());

export const UpdateProfileSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(50).optional(),
    lastName: z.string().max(50).optional(),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
