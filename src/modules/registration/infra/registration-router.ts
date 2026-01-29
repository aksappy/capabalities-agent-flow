import { Router } from 'express';
import { z } from 'zod';
import type { HashPassword, UserRepository } from '../domain/ports.js';
import { registerUser } from '../domain/register-user.js';

const registerBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const createRegistrationRouter = (
  repo: UserRepository,
  hashPassword: HashPassword
): Router => {
  const router = Router();
  router.post('/', async (req, res) => {
    const parsed = registerBodySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).end();
      return;
    }
    const { email, password } = parsed.data;
    const result = await registerUser(repo, hashPassword, email, password);
    if (result.kind === 'failure' && result.reason === 'email_already_taken') {
      res.status(409).end();
      return;
    }
    res.status(204).end();
  });
  return router;
};
