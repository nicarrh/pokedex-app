import { AppError } from '@/shared';

export function invalid(reason: string): never {
  throw new AppError('invalid-data', reason);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : invalid(`${key} must be a string`);
}

export function readNumber(source: Record<string, unknown>, key: string): number {
  const value = source[key];
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : invalid(`${key} must be a number`);
}

export function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : invalid(`${key} must be an array`);
}
