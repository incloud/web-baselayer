import { randomBytes } from 'crypto';

export const generateRandomToken = (length: number): string =>
  randomBytes(length).toString('hex');
