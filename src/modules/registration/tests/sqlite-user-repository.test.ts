import { describe, it, expect } from 'vitest';
import initSqlJs from 'sql.js';
import type { User } from '../domain/user.js';
import type { SqliteDb } from '../infra/sqlite-user-repository.js';
import { createSqliteUserRepository } from '../infra/sqlite-user-repository.js';

describe('Registration Database - save user', () => {
  it('when repository saves a user, then the user is persisted in the database', async () => {
    const SQL = await initSqlJs();
    const db = new SQL.Database() as unknown as SqliteDb;
    const repo = createSqliteUserRepository(db);

    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'saved@example.com',
      passwordHash: 'hashedpassword',
    };

    await repo.save(user);
    const found = await repo.findByEmail('saved@example.com');

    expect(found).not.toBeNull();
    expect(found?.id).toBe(user.id);
    expect(found?.email).toBe(user.email);
    expect(found?.passwordHash).toBe(user.passwordHash);

    if ('close' in db && typeof (db as { close: () => void }).close === 'function') {
      (db as { close: () => void }).close();
    }
  });
});

describe('Registration Database - fetch user by email', () => {
  it('when user exists in the database, then findByEmail returns the user', async () => {
    const SQL = await initSqlJs();
    const db = new SQL.Database() as unknown as SqliteDb;
    const repo = createSqliteUserRepository(db);

    const user: User = {
      id: 'aaaaaaaa-bbbb-12d3-a456-426614174000',
      email: 'fetch@example.com',
      passwordHash: 'storedhash',
    };
    await repo.save(user);

    const found = await repo.findByEmail('fetch@example.com');

    expect(found).toEqual(user);
    if ('close' in db && typeof (db as { close: () => void }).close === 'function') {
      (db as { close: () => void }).close();
    }
  });

  it('when no user exists for email, then findByEmail returns null', async () => {
    const SQL = await initSqlJs();
    const db = new SQL.Database() as unknown as SqliteDb;
    const repo = createSqliteUserRepository(db);

    const found = await repo.findByEmail('nonexistent@example.com');

    expect(found).toBeNull();
    if ('close' in db && typeof (db as { close: () => void }).close === 'function') {
      (db as { close: () => void }).close();
    }
  });
});
