import type { GetUserByEmail, IssueResetToken, SendResetPasswordEmail } from './ports.js';

export const requestPasswordReset = async (
  getUser: GetUserByEmail,
  issueResetToken: IssueResetToken,
  sendResetEmail: SendResetPasswordEmail,
  email: string
): Promise<void> => {
  const user = await getUser.findByEmail(email);
  if (user === null) {
    return;
  }
  const token = await issueResetToken.issue(user);
  await sendResetEmail.send(user.email, token);
};
