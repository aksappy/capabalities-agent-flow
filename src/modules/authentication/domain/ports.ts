import type { User } from '../../registration/domain/user.js';

export interface GetUserByEmail {
  findByEmail(email: string): Promise<User | null>;
}

export interface VerifyPassword {
  verify(plainPassword: string, hash: string): Promise<boolean>;
}

export interface IssueToken {
  issue(user: User): Promise<string>;
}

export interface LoginAttemptTracker {
  isBlocked(email: string): Promise<boolean>;
  recordFailedAttempt(email: string): Promise<void>;
}
