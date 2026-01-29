import express, { Request, Response, Router } from 'express';
import { Registration } from '../domain/registration';
import type { UserRepository } from '../domain/user-repository';

export const createRegistrationRoutes = (userRepository: UserRepository): Router => {
  const router = express.Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const registration = new Registration(userRepository);
      const result = await registration.register(email, password);

      if (result.success) {
        return res.status(204).send();
      } else {
        return res.status(400).json({ error: result.error });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
