# Authentication – Decisions

## 1. Port-based login (GetUserByEmail, VerifyPassword, IssueToken)

- **Context:** Login must find user by email, verify password, and issue a token without coupling domain to DB, bcrypt, or JWT.
- **Decision:** Introduce three ports: `GetUserByEmail` (findByEmail), `VerifyPassword` (verify(plain, hash)), `IssueToken` (issue(user)). Domain use case `loginUser` returns discriminated union `LoginResult` (success with token | failure with reason: user_not_found | invalid_password).
- **Consequences:** Domain stays pure. Infra will implement: UserRepository adapter for GetUserByEmail, bcrypt for VerifyPassword, JWT for IssueToken. Authentication module imports `User` type from registration domain (same entity).
