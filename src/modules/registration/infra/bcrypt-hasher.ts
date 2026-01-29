import bcrypt from 'bcrypt';
import type { HashPassword } from '../domain/ports.js';

const SALT_ROUNDS = 10;

export const createBcryptHasher = (): HashPassword => ({
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },
});
