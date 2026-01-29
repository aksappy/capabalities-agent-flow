import type {
  GetUserByEmail,
  IssueToken,
  LoginAttemptTracker,
  ValidateOneTimePin,
  VerifyPassword,
} from './ports.js';
import type { LoginResult } from './login-result.js';

export const loginUser = async (
  getUser: GetUserByEmail,
  verifyPassword: VerifyPassword,
  issueToken: IssueToken,
  attemptTracker: LoginAttemptTracker,
  validateOtp: ValidateOneTimePin,
  email: string,
  password: string,
  oneTimePin?: string,
  allowBlockedLoginWithOtp: boolean = false
): Promise<LoginResult> => {
  const user = await getUser.findByEmail(email);
  if (user === null) {
    return { kind: 'failure', reason: 'user_not_found' };
  }
  const blocked = await attemptTracker.isBlocked(email);
  if (blocked) {
    // #ambiguous – gated by feature flag; strategy (ValidateOneTimePin) provides OTP source when enabled.
    if (!allowBlockedLoginWithOtp) {
      return { kind: 'failure', reason: 'user_blocked' };
    }
    if (oneTimePin !== undefined) {
      const otpValid = await validateOtp.validate(email, oneTimePin);
      if (otpValid) {
        await attemptTracker.unblock(email);
        // Fall through to password verification below
      } else {
        return { kind: 'failure', reason: 'user_blocked' };
      }
    } else {
      return { kind: 'failure', reason: 'user_blocked' };
    }
  }
  const valid = await verifyPassword.verify(password, user.passwordHash);
  if (!valid) {
    await attemptTracker.recordFailedAttempt(email);
    return { kind: 'failure', reason: 'invalid_password' };
  }
  const token = await issueToken.issue(user);
  return { kind: 'success', token };
};
