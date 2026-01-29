import express, { Request, Response } from 'express';
import type { UserRepository } from './modules/registration/domain/ports.js';
import { createRegistrationRouter } from './modules/registration/infra/registration-router.js';
import { createBcryptHasher } from './modules/registration/infra/bcrypt-hasher.js';
import { createLoginRouter } from './modules/authentication/infra/login-router.js';
import { createBcryptVerifier } from './modules/authentication/infra/bcrypt-verifier.js';
import { createJwtIssuer } from './modules/authentication/infra/jwt-issuer.js';

export const createApp = (repo: UserRepository, jwtSecret: string): ReturnType<typeof express> => {
  const app = express();
  app.use(express.json());

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Express with TypeScript!' });
  });

  const hashPassword = createBcryptHasher();
  app.use('/register', createRegistrationRouter(repo, hashPassword));

  const verifyPassword = createBcryptVerifier();
  const issueToken = createJwtIssuer(jwtSecret);
  app.use('/login', createLoginRouter(repo, verifyPassword, issueToken));

  return app;
};
