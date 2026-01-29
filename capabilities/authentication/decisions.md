# Authentication – Decisions

## 1. Port-based login (GetUserByEmail, VerifyPassword, IssueToken)

- **Context:** Login must find user by email, verify password, and issue a token without coupling domain to DB, bcrypt, or JWT.
- **Decision:** Introduce three ports: `GetUserByEmail` (findByEmail), `VerifyPassword` (verify(plain, hash)), `IssueToken` (issue(user)). Domain use case `loginUser` returns discriminated union `LoginResult` (success with token | failure with reason: user_not_found | invalid_password).
- **Consequences:** Domain stays pure. Infra will implement: UserRepository adapter for GetUserByEmail, bcrypt for VerifyPassword, JWT for IssueToken. Authentication module imports `User` type from registration domain (same entity).

## 2. Block user after 3 failed login attempts

- **Context:** After more than 3 failed login attempts for an email, the user must be blocked and every subsequent attempt must return an authentication error without verifying the password.
- **Decision:** Introduce port `LoginAttemptTracker` with `isBlocked(email)` and `recordFailedAttempt(email)`. Domain checks `isBlocked` after finding the user (before password verification); on invalid password it calls `recordFailedAttempt`. New failure reason `user_blocked`. Block threshold (3) is implemented in infra (e.g. in-memory or persistent adapter).
- **Consequences:** Domain stays pure; lockout policy is pluggable. Infra provides `createInMemoryLoginAttemptTracker()` for the app; production could swap to a persistent store and/or add TTL for unblock.
