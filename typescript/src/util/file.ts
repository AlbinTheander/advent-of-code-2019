import { readFileSync } from 'fs';

export function readData(fname: string): string {
  return readFileSync(`../data/${fname}`, 'utf-8');
}
