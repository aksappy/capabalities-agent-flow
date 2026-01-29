import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'registration.db');

export const getDatabase = (): Database.Database => {
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  initializeDatabase(db);
  return db;
};

const initializeDatabase = (db: Database.Database): void => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      hashedPassword TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
