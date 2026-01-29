import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createRegistrationRoutes } from '../infra/registration-routes';
import { InMemoryUserRepository } from '../infra/in-memory-user-repository';

describe('Registration HTTP - Scenario 1: Invoke Registration Module', () => {
  let app: express.Application;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userRepository = new InMemoryUserRepository();
    app.use('/api', createRegistrationRoutes(userRepository));
  });

  it('should invoke registration module when POST /api/register with valid email and password', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'ValidPass123!',
      });

    expect(response.status).toBe(204);
  });
});
