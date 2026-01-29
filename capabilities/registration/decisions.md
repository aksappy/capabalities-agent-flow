# Registration – Decisions

## 1. Port-based repository and result type

- **Context:** Registration needs to check email uniqueness and persist users without coupling domain to a specific DB or framework.
- **Decision:** Introduce a `UserRepository` port (interface) with `findByEmail` and `save`. Use a discriminated union `RegisterResult` (`success` | `failure` with `reason: 'email_already_taken'`) so callers can handle outcomes without exceptions.
- **Consequences:** Domain stays pure (no DB/HTTP). Infra will implement the port (e.g. SQLite). Callers get explicit success/failure; duplicate email is a first-class outcome.

## 2. Password special-character rule

- **Context:** Scenario requires password to contain a special character before saving the user.
- **Decision:** Treat “special character” as any character that is not alphanumeric (regex `/[^a-zA-Z0-9]/`). Validation runs after length check, before email-uniqueness check.
- **Consequences:** Simple, consistent rule; easy to test. If product later requires a specific set of symbols, this can be narrowed via a config or strategy.

## 3. SQLite driver: sql.js

- **Context:** Database scenarios require a SQLite repository; better-sqlite3 native bindings failed to load in the environment (node-v115).
- **Decision:** Use sql.js (WASM, pure JS) for the SQLite implementation. Repository accepts a `SqliteDb` interface (run, exec) so the concrete driver is swappable.
- **Consequences:** No native build step; runs everywhere. In-memory by default; for file persistence we can pass a Database created from a buffer or use export(). Slightly slower than native; acceptable for registration volume.

## 4. HashPassword port for registration

- **Context:** Login uses bcrypt to verify passwords; registration must store a bcrypt hash so login can succeed.
- **Decision:** Add a `HashPassword` port (hash(password): Promise<string>) to registration domain. `registerUser` accepts it and hashes the password before saving. Infra provides `createBcryptHasher()` (bcrypt, 10 rounds).
- **Consequences:** Registration and login share the same hashing scheme; no plain-text passwords stored. Tests use an identity hasher (hash(p) => p) where hashing is irrelevant.
