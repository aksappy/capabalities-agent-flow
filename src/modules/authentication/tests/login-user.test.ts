import { describe, it, expect, vi } from 'vitest';
import { loginUser } from '../domain/login-user.js';
import type { GetUserByEmail, IssueToken, VerifyPassword } from '../domain/ports.js';
import type { User } from '../../registration/domain/user.js';

describe('Authentication - return JWT when user exists and password is correct', () => {
  it('when user exists and password is correct, then return a JWT token', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'storedhash',
    };
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(user),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(true),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('a-jwt-token'),
    };

    const result = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      'user@example.com',
      'correctpassword'
    );

    expect(result.kind).toBe('success');
    expect(result.token).toBe('a-jwt-token');
  });
});
