import type { GetUserByEmail, IssueToken, VerifyPassword } from './ports.js';
import type { LoginResult } from './login-result.js';

export const loginUser = async (
  getUser: GetUserByEmail,
  verifyPassword: VerifyPassword,
  issueToken: IssueToken,
  email: string,
  password: string
): Promise<LoginResult> => {
  const user = await getUser.findByEmail(email);
  if (user === null) {
    return { kind: 'failure', reason: 'user_not_found' };
  }
  const valid = await verifyPassword.verify(password, user.passwordHash);
  if (!valid) {
    return { kind: 'failure', reason: 'invalid_password' };
  }
  const token = await issueToken.issue(user);
  return { kind: 'success', token };
};
