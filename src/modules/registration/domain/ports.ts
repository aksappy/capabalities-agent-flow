import type { User } from './user.js';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

export interface HashPassword {
  hash(password: string): Promise<string>;
}
