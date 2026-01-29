import jwt, { type Secret } from 'jsonwebtoken';
import type { User } from '../../registration/domain/user.js';
import type { IssueToken } from '../domain/ports.js';

const DEFAULT_EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60; // 7 days

export const createJwtIssuer = (
  secret: string,
  expiresInSeconds: number = DEFAULT_EXPIRES_IN_SECONDS
): IssueToken => ({
  async issue(user: User): Promise<string> {
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      secret as Secret,
      { expiresIn: expiresInSeconds }
    );
    return token;
  },
});
