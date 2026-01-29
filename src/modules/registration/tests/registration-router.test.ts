import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { HashPassword, UserRepository } from '../domain/ports.js';
import { createRegistrationRouter } from '../infra/registration-router.js';

const identityHasher: HashPassword = {
  hash: (p) => Promise.resolve(p),
};

describe('Registration HTTP - invoke the registration module', () => {
  it('when HTTP request has email and password, then registration module is invoked', async () => {
    const findByEmail = vi.fn().mockResolvedValue(null);
    const save = vi.fn().mockResolvedValue(undefined);
    const repo: UserRepository = { findByEmail, save };

    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo, identityHasher));

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
    app.use('/register', createRegistrationRouter(repo, identityHasher));

    const response = await request(app)
      .post('/register')
      .send({ email: 'taken@example.com', password: 'password123!' });

    expect(response.status).toBe(409);
  });
});

describe('Registration HTTP - validate payload', () => {
  it('when payload has invalid email, respond with 400', async () => {
    const repo: UserRepository = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo, identityHasher));

    const response = await request(app)
      .post('/register')
      .send({ email: 'notanemail', password: 'password123!' });

    expect(response.status).toBe(400);
    expect(repo.findByEmail).not.toHaveBeenCalled();
  });

  it('when payload has password shorter than 8 characters, respond with 400', async () => {
    const repo: UserRepository = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo, identityHasher));

    const response = await request(app)
      .post('/register')
      .send({ email: 'user@example.com', password: 'short' });

    expect(response.status).toBe(400);
    expect(repo.findByEmail).not.toHaveBeenCalled();
  });
});

describe('Registration HTTP - success response', () => {
  it('when registration is successful, then respond with 204', async () => {
    const repo: UserRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const app = express();
    app.use(express.json());
    app.use('/register', createRegistrationRouter(repo, identityHasher));

    const response = await request(app)
      .post('/register')
      .send({ email: 'new@example.com', password: 'password123!' });

    expect(response.status).toBe(204);
  });
});
