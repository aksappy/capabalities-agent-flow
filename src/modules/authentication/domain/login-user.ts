import type {
  GetUserByEmail,
  IssueToken,
  LoginAttemptTracker,
  VerifyPassword,
} from './ports.js';
import type { LoginResult } from './login-result.js';

export const loginUser = async (
  getUser: GetUserByEmail,
  verifyPassword: VerifyPassword,
  issueToken: IssueToken,
  attemptTracker: LoginAttemptTracker,
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await getUser.findByEmail(email);
  if (user === null) {
    return { kind: 'failure', reason: 'user_not_found' };
  }
  const blocked = await attemptTracker.isBlocked(email);
  if (blocked) {
    return { kind: 'failure', reason: 'user_blocked' };
  }
  const valid = await verifyPassword.verify(password, user.passwordHash);
  if (!valid) {
    await attemptTracker.recordFailedAttempt(email);
    return { kind: 'failure', reason: 'invalid_password' };
  }
  const token = await issueToken.issue(user);
  return { kind: 'success', token };
};
