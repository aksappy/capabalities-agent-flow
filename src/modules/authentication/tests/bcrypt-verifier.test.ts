import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';
import { createBcryptVerifier } from '../infra/bcrypt-verifier.js';

describe('Bcrypt verifier adapter', () => {
  it('returns true when plain password matches hash', async () => {
    const plain = 'password123!';
    const hash = await bcrypt.hash(plain, 10);
    const verifier = createBcryptVerifier();

    const result = await verifier.verify(plain, hash);

    expect(result).toBe(true);
  });

  it('returns false when plain password does not match hash', async () => {
    const hash = await bcrypt.hash('correct', 10);
    const verifier = createBcryptVerifier();

    const result = await verifier.verify('wrong', hash);

    expect(result).toBe(false);
  });
});
