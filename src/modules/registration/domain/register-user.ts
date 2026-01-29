import { randomUUID } from 'node:crypto';
import type { User } from './user.js';
import type { UserRepository } from './ports.js';
import type { RegisterResult } from './register-result.js';

export const registerUser = async (
  repo: UserRepository,
  email: string,
  password: string
): Promise<RegisterResult> => {
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
