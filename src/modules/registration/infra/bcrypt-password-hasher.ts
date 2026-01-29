import bcrypt from 'bcrypt';
import type { PasswordHasher } from '../domain/password-hasher';

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}
