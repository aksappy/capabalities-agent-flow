import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { GetUserByEmail, IssueToken, VerifyPassword } from '../domain/ports.js';
import type { User } from '../../registration/domain/user.js';
import { createLoginRouter } from '../infra/login-router.js';

describe('Authentication HTTP - invoke the authentication module', () => {
  it('when HTTP request has email and password, then authentication module is invoked', async () => {
    const findByEmail = vi.fn().mockResolvedValue(null);
    const getUser: GetUserByEmail = { findByEmail };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(false),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };

    const app = express();
    app.use(express.json());
    app.use('/login', createLoginRouter(getUser, verifyPassword, issueToken));

    await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'password123' });

    expect(findByEmail).toHaveBeenCalledWith('user@example.com');
  });
});

describe('Authentication HTTP - invalid credentials return 401', () => {
  it('when credentials are invalid, then return 401', async () => {
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(null),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(false),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('token'),
    };

    const app = express();
    app.use(express.json());
    app.use('/login', createLoginRouter(getUser, verifyPassword, issueToken));

    const response = await request(app)
      .post('/login')
      .send({ email: 'unknown@example.com', password: 'wrong' });

    expect(response.status).toBe(401);
  });
});

describe('Authentication HTTP - valid credentials return 200 with JWT', () => {
  it('when credentials are valid, then return 200 with a JWT token in the response', async () => {
    const user: User = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      passwordHash: 'hash',
    };
    const getUser: GetUserByEmail = {
      findByEmail: vi.fn().mockResolvedValue(user),
    };
    const verifyPassword: VerifyPassword = {
      verify: vi.fn().mockResolvedValue(true),
    };
    const issueToken: IssueToken = {
      issue: vi.fn().mockResolvedValue('issued-jwt-token'),
    };

    const app = express();
    app.use(express.json());
    app.use('/login', createLoginRouter(getUser, verifyPassword, issueToken));

    const response = await request(app)
      .post('/login')
      .send({ email: 'user@example.com', password: 'correct' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token: 'issued-jwt-token' });
  });
});
