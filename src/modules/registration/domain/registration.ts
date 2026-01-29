import type { UserRepository } from './user-repository';
import type { PasswordHasher } from './password-hasher';

export interface RegistrationResult {
  success: boolean;
  error?: string;
}

export class Registration {
  private readonly SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{}|;':",./<>?]/;
  private userRepository: UserRepository;
  private passwordHasher: PasswordHasher;

  constructor(userRepository: UserRepository, passwordHasher?: PasswordHasher) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher || new NoOpPasswordHasher();
  }

  async register(email: string, password: string): Promise<RegistrationResult> {
    // Check password length
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      };
    }

    // Check for special character
    if (!this.SPECIAL_CHAR_REGEX.test(password)) {
      return {
        success: false,
        error: 'Password must contain at least one special character',
      };
    }

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email already exists',
      };
    }

    // Hash password and save user
    const hashedPassword = await this.passwordHasher.hash(password);
    await this.userRepository.save({
      email,
      hashedPassword,
    });

    return { success: true };
  }
}

// Default no-op hasher for simple testing
class NoOpPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return password;
  }
}
