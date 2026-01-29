import { describe, it, expect, vi } from 'vitest';
import { loginUser } from '../domain/login-user.js';
import type {
  GetUserByEmail,
  IssueToken,
  LoginAttemptTracker,
  VerifyPassword,
} from '../domain/ports.js';
import type { User } from '../../registration/domain/user.js';

const noBlockTracker: LoginAttemptTracker = {
  isBlocked: vi.fn().mockResolvedValue(false),
  recordFailedAttempt: vi.fn().mockResolvedValue(undefined),
};

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
      noBlockTracker,
      'user@example.com',
      'correctpassword'
    );

    expect(result.kind).toBe('success');
    expect(result.token).toBe('a-jwt-token');
  });
});

describe('Authentication - user does not exist returns authentication error', () => {
  it('when user does not exist, then return authentication error', async () => {
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(null),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(true),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };

    const result = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      noBlockTracker,
      'unknown@example.com',
      'anypassword'
    );

    expect(result.kind).toBe('failure');
    expect(result.reason).toBe('user_not_found');
    expect(issueToken.issue).not.toHaveBeenCalled();
  });
});

describe('Authentication - incorrect password returns authentication error', () => {
  it('when password is incorrect, then return authentication error', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'storedhash',
    };
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(user),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(false),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };

    const result = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      noBlockTracker,
      'user@example.com',
      'wrongpassword'
    );

    expect(result.kind).toBe('failure');
    expect(result.reason).toBe('invalid_password');
    expect(issueToken.issue).not.toHaveBeenCalled();
  });
});

describe('Authentication - block user after 3 failed logins', () => {
  it('when user tries login more than 3 times with wrong password, then return user_blocked and do not verify password', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'storedhash',
    };
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(user),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(false),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };
    let failedCount = 0;
    const attemptTracker: LoginAttemptTracker = {
      isBlocked: vi.fn().mockImplementation(() => Promise.resolve(failedCount >= 3)),
      recordFailedAttempt: vi.fn().mockImplementation(() => {
        failedCount += 1;
        return Promise.resolve();
      }),
    };

    const result1 = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      attemptTracker,
      'user@example.com',
      'wrong1'
    );
    const result2 = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      attemptTracker,
      'user@example.com',
      'wrong2'
    );
    const result3 = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      attemptTracker,
      'user@example.com',
      'wrong3'
    );
    const verifyCallCountAfterThree = (verifyPassword.verify as ReturnType<typeof vi.fn>).mock.calls.length;
    const result4 = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      attemptTracker,
      'user@example.com',
      'wrong4'
    );
    const verifyCallCountAfterFour = (verifyPassword.verify as ReturnType<typeof vi.fn>).mock.calls.length;

    expect(result1.kind).toBe('failure');
    expect(result1.reason).toBe('invalid_password');
    expect(result2.kind).toBe('failure');
    expect(result2.reason).toBe('invalid_password');
    expect(result3.kind).toBe('failure');
    expect(result3.reason).toBe('invalid_password');
    expect(result4.kind).toBe('failure');
    expect(result4.reason).toBe('user_blocked');
    expect(verifyCallCountAfterFour).toBe(verifyCallCountAfterThree);
  });
});
