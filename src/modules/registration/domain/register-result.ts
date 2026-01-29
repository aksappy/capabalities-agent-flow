import { z } from 'zod';

export const registerSuccessSchema = z.object({ kind: z.literal('success') });
export const registerFailureSchema = z.object({
  kind: z.literal('failure'),
  reason: z.enum(['email_already_taken', 'password_too_short']),
});
export const registerResultSchema = z.discriminatedUnion('kind', [
  registerSuccessSchema,
  registerFailureSchema,
]);

export type RegisterSuccess = z.infer<typeof registerSuccessSchema>;
export type RegisterFailure = z.infer<typeof registerFailureSchema>;
export type RegisterResult = z.infer<typeof registerResultSchema>;
