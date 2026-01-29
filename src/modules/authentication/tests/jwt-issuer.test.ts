import { describe, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';
import type { User } from '../../registration/domain/user.js';
import { createJwtIssuer } from '../infra/jwt-issuer.js';

describe('JWT issuer adapter', () => {
  it('issues a JWT token containing user id and email', async () => {
    const secret = 'test-secret';
    const issuer = createJwtIssuer(secret);
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'hash',
    };

    const token = await issuer.issue(user);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    const decoded = jwt.verify(token, secret) as { sub: string; email: string };
    expect(decoded.sub).toBe(user.id);
    expect(decoded.email).toBe(user.email);
  });
});
