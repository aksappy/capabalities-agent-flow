# Forgot password – Decisions

## 1. Port-based request reset (GetUserByEmail, IssueResetToken, SendResetPasswordEmail)

- **Context:** Requesting a password reset must find the user, issue a reset token, and send an email without coupling domain to DB, JWT, or email infra.
- **Decision:** Introduce three ports: `GetUserByEmail` (findByEmail), `IssueResetToken` (issue(user)), `SendResetPasswordEmail` (send(email, resetToken)). Use case `requestPasswordReset` returns `Promise<void>` (always success) to avoid email enumeration: when user exists, issue token and send email; when user does not exist, do nothing and still succeed.
- **Consequences:** Domain stays pure. Infra will implement: UserRepository adapter for GetUserByEmail, short-lived JWT or stored token for IssueResetToken, email service for SendResetPasswordEmail. No information leak about whether an email is registered.

## 2. UnblockUser port (#integration with authentication)

- **Context:** Scenario requires that when a blocked user requests a password reset, the user is unblocked (e.g. after too many failed logins per authentication infra).
- **Decision:** Add an `UnblockUser` port (unblock(user): Promise<void>). In `requestPasswordReset`, when user exists, call `unblockUser.unblock(user)` before issuing the reset token and sending the email. The adapter can no-op when the user is not blocked (e.g. check auth/blocked state and only clear it if set).
- **Consequences:** Forgot-password domain stays decoupled from auth storage; authentication infra can implement the port (e.g. clear blocked flag or failed-attempts for the user). Integration is via the port only.
