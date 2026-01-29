import { Router } from 'express';
import type { UserRepository } from '../domain/ports.js';
import { registerUser } from '../domain/register-user.js';

export const createRegistrationRouter = (repo: UserRepository): Router => {
  const router = Router();
  router.post('/', async (req, res) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await registerUser(repo, email, password);
    if (result.kind === 'failure' && result.reason === 'email_already_taken') {
      res.status(409).end();
      return;
    }
    res.status(200).end();
  });
  return router;
};
