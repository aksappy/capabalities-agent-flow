# Forgot password – Decisions

## 1. Port-based request reset (GetUserByEmail, IssueResetToken, SendResetPasswordEmail)

- **Context:** Requesting a password reset must find the user, issue a reset token, and send an email without coupling domain to DB, JWT, or email infra.
- **Decision:** Introduce three ports: `GetUserByEmail` (findByEmail), `IssueResetToken` (issue(user)), `SendResetPasswordEmail` (send(email, resetToken)). Use case `requestPasswordReset` returns `Promise<void>` (always success) to avoid email enumeration: when user exists, issue token and send email; when user does not exist, do nothing and still succeed.
- **Consequences:** Domain stays pure. Infra will implement: UserRepository adapter for GetUserByEmail, short-lived JWT or stored token for IssueResetToken, email service for SendResetPasswordEmail. No information leak about whether an email is registered.
