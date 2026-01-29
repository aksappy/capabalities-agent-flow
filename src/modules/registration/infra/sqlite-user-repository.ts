import type Database from 'better-sqlite3';
import type { User, UserRepository } from '../domain/user-repository';

export class SqliteUserRepository implements UserRepository {
  constructor(private db: Database.Database) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const stmt = this.db.prepare('SELECT email, hashedPassword FROM users WHERE email = ?');
      const user = stmt.get(email) as User | undefined;
      return user || null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  async save(user: User): Promise<void> {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO users (email, hashedPassword) VALUES (?, ?)'
      );
      stmt.run(user.email, user.hashedPassword);
    } catch (error) {
      if ((error as any).code === 'SQLITE_CONSTRAINT') {
        throw new Error('Email already exists');
      }
      throw new Error(`Failed to save user: ${error}`);
    }
  }
}
