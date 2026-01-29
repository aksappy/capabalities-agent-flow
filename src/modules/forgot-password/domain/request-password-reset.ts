import type {
  GetUserByEmail,
  IssueResetToken,
  SendResetPasswordEmail,
  UnblockUser,
} from './ports.js';

export const requestPasswordReset = async (
  getUser: GetUserByEmail,
  unblockUser: UnblockUser,
  issueResetToken: IssueResetToken,
  sendResetEmail: SendResetPasswordEmail,
  email: string
): Promise<void> => {
  const user = await getUser.findByEmail(email);
  if (user === null) {
    return;
  }
  await unblockUser.unblock(user);
  const token = await issueResetToken.issue(user);
  await sendResetEmail.send(user.email, token);
};
