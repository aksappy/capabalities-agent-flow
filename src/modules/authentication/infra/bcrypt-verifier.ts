import bcrypt from 'bcrypt';
import type { VerifyPassword } from '../domain/ports.js';

export const createBcryptVerifier = (): VerifyPassword => ({
  async verify(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  },
});
