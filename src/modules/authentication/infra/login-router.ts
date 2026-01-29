import { Router } from 'express';
import { loginUser } from '../domain/login-user.js';
import type {
  GetUserByEmail,
  IssueToken,
  LoginAttemptTracker,
  ValidateOneTimePin,
  VerifyPassword,
} from '../domain/ports.js';

export const createLoginRouter = (
  getUser: GetUserByEmail,
  verifyPassword: VerifyPassword,
  issueToken: IssueToken,
  attemptTracker: LoginAttemptTracker,
  validateOtp: ValidateOneTimePin,
  allowBlockedLoginWithOtp: boolean = false
): Router => {
  const router = Router();
  router.post('/', async (req, res) => {
    const { email, password, oneTimePin } = req.body as {
      email: string;
      password: string;
      oneTimePin?: string;
    };
    const result = await loginUser(
      getUser,
      verifyPassword,
      issueToken,
      attemptTracker,
      validateOtp,
      email,
      password,
      oneTimePin,
      allowBlockedLoginWithOtp
    );
    if (result.kind === 'failure') {
      res.status(401).end();
      return;
    }
    res.status(200).json({ token: result.token });
  });
  return router;
};
