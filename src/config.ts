import type { Bindings } from './types';

const DEFAULT_MIN_PATH_LENGTH = 1;
const DEFAULT_MAX_PATH_LENGTH = 4;
const DEFAULT_RANDOM_PATH_LENGTH = 6;
const DEFAULT_RATE_LIMIT = 60;
const DEFAULT_SESSION_DURATION = 86400;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getPathLengthRange(
  env: Pick<Bindings, 'PATH_MAX_LENGTH' | 'PATH_MIN_LENGTH'>,
) {
  const minLength = parsePositiveInt(
    env.PATH_MIN_LENGTH,
    DEFAULT_MIN_PATH_LENGTH,
  );
  const maxLength = parsePositiveInt(
    env.PATH_MAX_LENGTH,
    DEFAULT_MAX_PATH_LENGTH,
  );

  return {
    minLength,
    maxLength: Math.max(minLength, maxLength),
  };
}

export function getRandomPathLength(
  env: Pick<Bindings, 'PATH_MAX_LENGTH' | 'PATH_MIN_LENGTH' | 'RANDOM_PATH_LENGTH'>,
): number {
  const { minLength, maxLength } = getPathLengthRange(env);
  const preferredLength = parsePositiveInt(
    env.RANDOM_PATH_LENGTH,
    DEFAULT_RANDOM_PATH_LENGTH,
  );

  return Math.min(maxLength, Math.max(minLength, preferredLength));
}

export function getRateLimitPerMinute(
  env: Pick<Bindings, 'RATE_LIMIT_PER_MINUTE'>,
): number {
  return parsePositiveInt(env.RATE_LIMIT_PER_MINUTE, DEFAULT_RATE_LIMIT);
}

export function getSessionDuration(
  env: Pick<Bindings, 'SESSION_DURATION'>,
): number {
  return parsePositiveInt(env.SESSION_DURATION, DEFAULT_SESSION_DURATION);
}
