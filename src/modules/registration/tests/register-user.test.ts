import { describe, it, expect, vi } from 'vitest';
import { registerUser } from '../domain/register-user.js';
import type { UserRepository } from '../domain/ports.js';

describe('Registration - register only when the email is unique', () => {
  it('when email is unique, registration succeeds and user is saved', async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const repo: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      save,
    };

    const result = await registerUser(
      repo,
      'new@example.com',
      'password123'
    );

    expect(result.kind).toBe('success');
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@example.com',
        passwordHash: expect.any(String),
        id: expect.any(String),
      })
    );
  });
});

describe('Registration - register only when password is at least 8 characters long', () => {
  it('when password is shorter than 8 characters, registration fails with password_too_short', async () => {
    const repo: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    };

    const result = await registerUser(repo, 'new@example.com', 'short');

    expect(result.kind).toBe('failure');
    expect(result.reason).toBe('password_too_short');
  });
});
