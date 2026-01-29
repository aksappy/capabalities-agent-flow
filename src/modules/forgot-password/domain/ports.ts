import type { User } from '../../registration/domain/user.js';

export interface GetUserByEmail {
  findByEmail(email: string): Promise<User | null>;
}

export interface IssueResetToken {
  issue(user: User): Promise<string>;
}

export interface SendResetPasswordEmail {
  send(email: string, resetToken: string): Promise<void>;
}

export interface UnblockUser {
  unblock(user: User): Promise<void>;
}
