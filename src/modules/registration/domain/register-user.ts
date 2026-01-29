import { randomUUID } from 'node:crypto';
import type { User } from './user.js';
import type { UserRepository } from './ports.js';
import type { RegisterResult } from './register-result.js';

const MIN_PASSWORD_LENGTH = 8;

export const registerUser = async (
  repo: UserRepository,
  email: string,
  password: string
): Promise<RegisterResult> => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { kind: 'failure', reason: 'password_too_short' };
  }
  const existing = await repo.findByEmail(email);
  if (existing !== null) {
    return { kind: 'failure', reason: 'email_already_taken' };
  }
  const user: User = {
    id: randomUUID(),
    email,
    passwordHash: password,
  };
  await repo.save(user);
  return { kind: 'success' };
};
