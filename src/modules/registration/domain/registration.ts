interface RegistrationResult {
  success: boolean;
  error?: string;
}

interface User {
  email: string;
  hashedPassword: string;
}

export class Registration {
  private users: Map<string, User> = new Map();

  async register(email: string, password: string): Promise<RegistrationResult> {
    // Check if email already exists
    if (this.users.has(email)) {
      return {
        success: false,
        error: 'Email already exists',
      };
    }

    // For now, store with plain password (will add hashing in next iteration)
    this.users.set(email, {
      email,
      hashedPassword: password,
    });

    return { success: true };
  }
}
