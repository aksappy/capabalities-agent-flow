import type { ValidateOneTimePin } from '../domain/ports.js';

/**
 * Strategy: no-op OTP validation.
 * #ambiguous – Current expectation is OTP via forgot-password flow, but pending final decision.
 * Use this strategy when OTP-for-blocked-login is not yet integrated; replace with
 * forgot-password OTP validator when integration is decided.
 */
export const createNoOpOtpValidator = (): ValidateOneTimePin => ({
  validate: async () => false,
});
