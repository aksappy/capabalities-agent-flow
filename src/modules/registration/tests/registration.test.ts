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

describe('Registration - Scenario 2: Password Length Validation', () => {
  let registration: Registration;

  beforeEach(() => {
    registration = new Registration();
  });

  it('should reject registration when password is less than 8 characters', async () => {
    const email = 'test@example.com';
    const shortPassword = 'Short1!';

    const result = await registration.register(email, shortPassword);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Password must be at least 8 characters long');
  });
});
