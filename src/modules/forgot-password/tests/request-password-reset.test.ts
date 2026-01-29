import { describe, it, expect, vi } from 'vitest';
import { requestPasswordReset } from '../domain/request-password-reset.js';
import type { GetUserByEmail, IssueResetToken, SendResetPasswordEmail } from '../domain/ports.js';
import type { User } from '../../registration/domain/user.js';

describe('Forgot password - send reset password email', () => {
  it('when user exists, then send a reset password email with a token', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'hash',
    };
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(user),
    };
    const issueResetToken: IssueResetToken = {
      issue: vi.fn().mockResolvedValue('reset-token-123'),
    };
    const sendResetEmail: SendResetPasswordEmail = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    await requestPasswordReset(
      getUser,
      issueResetToken,
      sendResetEmail,
      'user@example.com'
    );

    expect(sendResetEmail.send).toHaveBeenCalledTimes(1);
    expect(sendResetEmail.send).toHaveBeenCalledWith('user@example.com', 'reset-token-123');
  });

  it('when user does not exist, then do not send email', async () => {
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(null),
    };
    const issueResetToken: IssueResetToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };
    const sendResetEmail: SendResetPasswordEmail = {
      send: vi.fn().mockResolvedValue(undefined),
    };

    await requestPasswordReset(
      getUser,
      issueResetToken,
      sendResetEmail,
      'unknown@example.com'
    );

    expect(sendResetEmail.send).not.toHaveBeenCalled();
  });
});
