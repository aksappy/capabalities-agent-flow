import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { UserRepository } from '../domain/ports.js';
import { createRegistrationRouter } from '../infra/registration-router.js';

describe('Registration HTTP - invoke the registration module', () => {
  it('when HTTP request has email and password, then registration module is invoked', async () => {
    const findByEmail = vi.fn().mockResolvedValue(null);
    const save = vi.fn().mockResolvedValue(undefined);
    const repo: UserRepository = { findByEmail, save };

    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo));

    await request(app)
      .post('/register')
      .send({ email: 'user@example.com', password: 'password123!' });

    expect(findByEmail).toHaveBeenCalledWith('user@example.com');
  });
});

describe('Registration HTTP - conflict when email is duplicate', () => {
  it('when email is duplicate from domain, then return conflict response', async () => {
    const existingUser = {
      id: 'existing-id',
      email: 'taken@example.com',
      passwordHash: 'hash',
    };
    const repo: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(existingUser),
      save: vi.fn().mockResolvedValue(undefined),
    };

    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo));

    const response = await request(app)
      .post('/register')
      .send({ email: 'taken@example.com', password: 'password123!' });

    expect(response.status).toBe(409);
  });
});
