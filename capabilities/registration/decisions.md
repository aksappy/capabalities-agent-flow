# Registration – Decisions

## 1. Port-based repository and result type

- **Context:** Registration needs to check email uniqueness and persist users without coupling domain to a specific DB or framework.
- **Decision:** Introduce a `UserRepository` port (interface) with `findByEmail` and `save`. Use a discriminated union `RegisterResult` (`success` | `failure` with `reason: 'email_already_taken'`) so callers can handle outcomes without exceptions.
- **Consequences:** Domain stays pure (no DB/HTTP). Infra will implement the port (e.g. SQLite). Callers get explicit success/failure; duplicate email is a first-class outcome.

## 2. Password special-character rule

- **Context:** Scenario requires password to contain a special character before saving the user.
- **Decision:** Treat “special character” as any character that is not alphanumeric (regex `/[^a-zA-Z0-9]/`). Validation runs after length check, before email-uniqueness check.
- **Consequences:** Simple, consistent rule; easy to test. If product later requires a specific set of symbols, this can be narrowed via a config or strategy.
