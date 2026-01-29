import initSqlJs from 'sql.js';
import { createApp } from './app.js';
import { createSqliteUserRepository } from './modules/registration/infra/sqlite-user-repository.js';
import type { SqliteDb } from './modules/registration/infra/sqlite-user-repository.js';

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-in-production';

initSqlJs()
  .then((SQL: Awaited<ReturnType<typeof initSqlJs>>) => {
    const db = new SQL.Database() as unknown as SqliteDb;
    const repo = createSqliteUserRepository(db);
    const app = createApp(repo, JWT_SECRET);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
