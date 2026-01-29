import { randomUUID } from 'node:crypto';
import type { User } from './user.js';
import type { UserRepository } from './ports.js';
import type { RegisterResult } from './register-result.js';

const MIN_PASSWORD_LENGTH = 8;
const SPECIAL_CHAR_REGEX = /[^a-zA-Z0-9]/;

export const registerUser = async (
  repo: UserRepository,
  email: string,
  password: string
): Promise<RegisterResult> => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { kind: 'failure', reason: 'password_too_short' };
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return { kind: 'failure', reason: 'password_must_contain_special_character' };
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
