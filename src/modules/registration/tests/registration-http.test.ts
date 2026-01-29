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

describe('Registration HTTP - Scenario 2: Duplicate Email Returns 409', () => {
  let app: express.Application;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userRepository = new InMemoryUserRepository();
    app.use('/api', createRegistrationRoutes(userRepository));
  });

  it('should return 409 Conflict when email already exists', async () => {
    const email = 'test@example.com';
    const password = 'ValidPass123!';

    // Register first user
    await request(app)
      .post('/api/register')
      .send({ email, password });

    // Attempt to register with same email
    const response = await request(app)
      .post('/api/register')
      .send({ email, password });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email already exists');
  });
});

describe('Registration HTTP - Scenario 3: Validate Payload Returns 400', () => {
  let app: express.Application;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    userRepository = new InMemoryUserRepository();
    app.use('/api', createRegistrationRoutes(userRepository));
  });

  it('should return 400 when email is invalid', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'not-an-email',
        password: 'ValidPass123!',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should return 400 when password is less than 8 characters', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'Short1!',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });
});
