import { describe, it, expect, beforeEach } from 'vitest';
import { Registration } from '../domain/registration';

describe('Registration - Scenario 1: Email Uniqueness', () => {
  let registration: Registration;

  beforeEach(() => {
    registration = new Registration();
  });

  it('should reject registration when email is not unique', async () => {
    const email = 'test@example.com';
    const password = 'ValidPass123!';

    // Register first user
    await registration.register(email, password);

    // Attempt to register with same email should fail
    const result = await registration.register(email, password);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Email already exists');
  });
});
