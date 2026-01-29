declare module 'sql.js' {
  interface Database {
    run(sql: string, params?: unknown[]): void;
    exec(sql: string, params?: unknown[]): Array<{ columns: string[]; values: unknown[][] }>;
    close(): void;
  }
  interface SqlJsStatic {
    Database: new () => Database;
  }
  function initSqlJs(config?: unknown): Promise<SqlJsStatic>;
  export = initSqlJs;
}
