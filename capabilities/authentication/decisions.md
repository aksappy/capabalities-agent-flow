# Authentication – Decisions

## 1. Port-based login (GetUserByEmail, VerifyPassword, IssueToken)

- **Context:** Login must find user by email, verify password, and issue a token without coupling domain to DB, bcrypt, or JWT.
- **Decision:** Introduce three ports: `GetUserByEmail` (findByEmail), `VerifyPassword` (verify(plain, hash)), `IssueToken` (issue(user)). Domain use case `loginUser` returns discriminated union `LoginResult` (success with token | failure with reason: user_not_found | invalid_password).
- **Consequences:** Domain stays pure. Infra will implement: UserRepository adapter for GetUserByEmail, bcrypt for VerifyPassword, JWT for IssueToken. Authentication module imports `User` type from registration domain (same entity).

## 2. Block user after 3 failed login attempts

- **Context:** After more than 3 failed login attempts for an email, the user must be blocked and every subsequent attempt must return an authentication error without verifying the password.
- **Decision:** Introduce port `LoginAttemptTracker` with `isBlocked(email)` and `recordFailedAttempt(email)`. Domain checks `isBlocked` after finding the user (before password verification); on invalid password it calls `recordFailedAttempt`. New failure reason `user_blocked`. Block threshold (3) is implemented in infra (e.g. in-memory or persistent adapter).
- **Consequences:** Domain stays pure; lockout policy is pluggable. Infra provides `createInMemoryLoginAttemptTracker()` for the app; production could swap to a persistent store and/or add TTL for unblock.

## 3. Blocked user can login with one-time-pin (#ambiguous, #integration)

- **Context:** When a user is blocked (e.g. after 3 failed logins), they must be able to attempt login with a one-time-pin. How the user obtains the OTP is ambiguous (e.g. via forgot-password flow); capabilities must integrate via interfaces only.
- **Decision:** Introduce port `ValidateOneTimePin` with `validate(email, pin)`. Add `unblock(email)` to `LoginAttemptTracker`. When blocked, if `oneTimePin` is provided and `validateOtp.validate(email, oneTimePin)` returns true, call `attemptTracker.unblock(email)` and continue with password verification; otherwise return `user_blocked`. Login use case and HTTP router accept optional `oneTimePin`; app wires a no-op OTP validator (always false) until forgot-password or another infra provides a real implementation.
- **Consequences:** Domain stays pure; OTP source is pluggable. Forgot-password (or another capability) can implement `ValidateOneTimePin` and optionally call unblock when sending reset/OTP. #ambiguous comment in code: "Current expectation is OTP via forgot-password flow, but pending final decision."

## 4. #ambiguous managed by Strategy + Feature flag

- **Context:** CLAUDE requires volatile business rules (#ambiguous) to be implemented with Strategy Pattern or Feature Flags, not hardcoded logic.
- **Decision:** **Strategy:** `ValidateOneTimePin` is the strategy interface; infra provides `createNoOpOtpValidator()` (no-op strategy). Forgot-password (or another module) can provide a concrete strategy later. **Feature flag:** `allowBlockedLoginWithOtp` (boolean) gates the blocked-login-with-OTP path. When false, blocked users always get `user_blocked` and the OTP strategy is never invoked; when true, the injected `ValidateOneTimePin` strategy is used. Flag is passed from app into router and use case (can be driven by config/env later).
- **Consequences:** No hardcoded OTP source; behavior can be toggled without code change. Test added: when flag is off, OTP strategy is not called.
