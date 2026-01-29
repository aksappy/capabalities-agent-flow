import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import type { GetUserByEmail, IssueToken, VerifyPassword } from '../domain/ports.js';
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
