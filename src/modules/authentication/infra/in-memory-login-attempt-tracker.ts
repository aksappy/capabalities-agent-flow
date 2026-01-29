import type { LoginAttemptTracker } from '../domain/ports.js';

const BLOCK_THRESHOLD = 3;

export const createInMemoryLoginAttemptTracker = (): LoginAttemptTracker => {
  const failedCountByEmail = new Map<string, number>();

  return {
    isBlocked: async (email: string): Promise<boolean> => {
      const count = failedCountByEmail.get(email) ?? 0;
      return count >= BLOCK_THRESHOLD;
    },
    recordFailedAttempt: async (email: string): Promise<void> => {
      const count = failedCountByEmail.get(email) ?? 0;
      failedCountByEmail.set(email, count + 1);
    },
  };
};
