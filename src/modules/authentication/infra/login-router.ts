import { Router } from 'express';
import { loginUser } from '../domain/login-user.js';
import type { GetUserByEmail, IssueToken, VerifyPassword } from '../domain/ports.js';

export const createLoginRouter = (
  getUser: GetUserByEmail,
  verifyPassword: VerifyPassword,
  issueToken: IssueToken
): Router => {
  const router = Router();
  router.post('/', async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    await loginUser(getUser, verifyPassword, issueToken, email, password);
    res.status(200).end();
  });
  return router;
};
