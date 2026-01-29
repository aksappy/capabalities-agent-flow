import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createApp } from './app.js';
import type { UserRepository } from './modules/registration/domain/ports.js';

const mockRepo: UserRepository = {
  findByEmail: vi.fn().mockResolvedValue(null),
  save: vi.fn().mockResolvedValue(undefined),
};

describe('GET /', () => {
  it('should return a greeting message', async () => {
    const app = createApp(mockRepo, 'test-secret');
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello from Express with TypeScript!' });
  });
});
