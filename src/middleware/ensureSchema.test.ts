import { describe, expect, it } from 'vitest';
import { ensureSchema } from './ensureSchema';

describe('ensureSchema', () => {
  it('runs schema bootstrap statements before handling request', async () => {
    const executed: string[] = [];

    const context = {
      env: {
        DB: {
          prepare(sql: string) {
            return {
              bind() {
                return this;
              },
              async first() {
                return null;
              },
              async all() {
                return { results: [], success: true };
              },
              async run() {
                executed.push(sql);
                return { results: [], success: true };
              },
              async raw() {
                return [];
              },
            };
          },
        },
      },
    } as any;

    let nextCalled = false;
    await ensureSchema(context, async () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
    expect(executed.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS notes'))).toBe(true);
    expect(executed.some((sql) => sql.includes('CREATE TABLE IF NOT EXISTS admin_logs'))).toBe(true);
  });
});
