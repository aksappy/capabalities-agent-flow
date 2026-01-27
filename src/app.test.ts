import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /', () => {
    it('should return a greeting message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Hello from Express with TypeScript!' });
    });
});
