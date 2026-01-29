import type { User } from '../domain/user.js';
import type { UserRepository } from '../domain/ports.js';

const USERS_SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`;

export interface SqliteDb {
  run(sql: string, params?: unknown[]): void;
  exec(sql: string, params?: unknown[]): Array<{ columns: string[]; values: unknown[][] }>;
}

export const createSqliteUserRepository = (db: SqliteDb): UserRepository => {
  db.run(USERS_SCHEMA);

  return {
    async save(user: User): Promise<void> {
      db.run(
        'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
        [user.id, user.email, user.passwordHash]
      );
    },
    async findByEmail(email: string): Promise<User | null> {
      const results = db.exec(
        'SELECT id, email, password_hash FROM users WHERE email = ?',
        [email]
      );
      const first = results[0];
      if (!first || first.values.length === 0) return null;
      const row = first.values[0];
      return {
        id: row[0] as string,
        email: row[1] as string,
        passwordHash: row[2] as string,
      };
    },
  };
};
