import type { User, UserRepository } from '../domain/user-repository';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.email, user);
  }
}
