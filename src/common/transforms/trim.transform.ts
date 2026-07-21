import { Transform } from 'class-transformer';

export function TrimAndClean() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;

    return value
      .trim()
      .replace(/[^a-zA-Z0-9 ]+/g, '') // remove special chars
      .replace(/\s+/g, ' '); // normalize spaces
  });
}
