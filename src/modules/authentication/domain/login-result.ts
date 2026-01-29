import { z } from 'zod';

export const loginSuccessSchema = z.object({
  kind: z.literal('success'),
  token: z.string(),
});
export const loginFailureSchema = z.object({
  kind: z.literal('failure'),
  reason: z.enum(['user_not_found', 'invalid_password', 'user_blocked']),
});
export const loginResultSchema = z.discriminatedUnion('kind', [
  loginSuccessSchema,
  loginFailureSchema,
]);

export type LoginSuccess = z.infer<typeof loginSuccessSchema>;
export type LoginFailure = z.infer<typeof loginFailureSchema>;
export type LoginResult = z.infer<typeof loginResultSchema>;
