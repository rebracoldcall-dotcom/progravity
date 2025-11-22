import { z } from "zod";

export const AuthSessionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  email: z.string().email(),
  isAuthenticated: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  createdAt: z.date(),
});

export type AuthSession = z.infer<typeof AuthSessionSchema>;
export type User = z.infer<typeof UserSchema>;
