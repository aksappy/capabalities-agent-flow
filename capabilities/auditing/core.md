# Model
```typescript
interface AuditLog {
    id: string;
    userId: string;
    action: string;
    createdAt: Date;
}
```
[ ] Given a user, when user is registered, then audit log should be created asynchronously #integration [registration](../registration/user_registration.md)
[ ] Given a user, when user is logged in, then audit log should be created asynchronously [authentication](../authentication/user_authentication.md)
[ ] Given a user, when user is logged out, then audit log should be created asynchronously [authentication](../authentication/user_authentication.md)
[ ] Given a user, when user is blocked, then audit log should be created asynchronously [authentication](../authentication/user_authentication.md)
