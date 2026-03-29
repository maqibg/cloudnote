import { describe, expect, it } from 'vitest';
import {
  getPathLengthRange,
  getRandomPathLength,
  getRateLimitPerMinute,
  getSessionDuration,
} from './config';

describe('config helpers', () => {
  it('parses path range with sane defaults', () => {
    expect(
      getPathLengthRange({
        PATH_MIN_LENGTH: '2',
        PATH_MAX_LENGTH: '8',
      }),
    ).toEqual({
      minLength: 2,
      maxLength: 8,
    });

    expect(
      getPathLengthRange({
        PATH_MIN_LENGTH: '5',
        PATH_MAX_LENGTH: '1',
      }),
    ).toEqual({
      minLength: 5,
      maxLength: 5,
    });
  });

  it('falls back for invalid rate limit and session values', () => {
    expect(
      getRateLimitPerMinute({
        RATE_LIMIT_PER_MINUTE: 'not-a-number',
      }),
    ).toBe(60);

    expect(
      getSessionDuration({
        SESSION_DURATION: 'bad',
      }),
    ).toBe(86400);
  });

  it('uses fixed random path length with default fallback 6', () => {
    expect(
      getRandomPathLength({
        PATH_MIN_LENGTH: '1',
        PATH_MAX_LENGTH: '20',
        RANDOM_PATH_LENGTH: '6',
      }),
    ).toBe(6);

    expect(
      getRandomPathLength({
        PATH_MIN_LENGTH: '8',
        PATH_MAX_LENGTH: '20',
        RANDOM_PATH_LENGTH: '6',
      }),
    ).toBe(8);
  });
});
