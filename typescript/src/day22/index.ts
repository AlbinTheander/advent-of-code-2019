import { readData } from '../util/file';

type LinearFn = [bigint, bigint];

function parseData(s: string, deckSize: bigint): LinearFn {
  let a = 1n;
  let b = 0n;
  s.split('\n').forEach(line => {
    const n = BigInt((line.match(/-?\d+/g) || [''])[0]);
    if (line.includes('cut')) b -= n;
    if (line.includes('deal with increment')) {
      a = (a * n) % deckSize;
      b = (b * n) % deckSize;
    }
    if (line.includes('deal into new stack')) {
      a = -a;
      b = deckSize - 1n - b;
    }
  });
  return [a, b];
}

function fnAppliedNtimes([a, b]: LinearFn, n: bigint, max: bigint): LinearFn {
  if (n === 1n) return [a, b];
  const nextN = n % 2n === 0n ? n >> 1n : (n - 1n) / 2n;
  const [a2, b2] = fnAppliedNtimes([a, b], nextN, max);
  let a1 = (a2 * a2) % max;
  let b1 = (a2 * b2 + b2) % max;
  if (n % 2n === 1n) {
    a1 = (a * a1) % max;
    b1 = (a * b1 + b) % max;
  }
  return [a1, b1];
}

function newPosition([a, b]: LinearFn, deckSize: bigint, card: bigint): bigint {
  const result = (a * card + b) % deckSize;
  return result < 0 ? deckSize + result : result;
}

function extendedGcd(a: bigint, b: bigint): [bigint, bigint, bigint] {
  if (a === 0n) return [b, 0n, 1n];
  const [g, x, y] = extendedGcd(b % a, a);
  return [g, y - x * (b / a), x];
}

function part1(moves: string): bigint {
  const deckSize = 10007n;
  const fn = parseData(moves, deckSize);
  return newPosition(fn, deckSize, 2019n);
}

function part2(moves: string): bigint {
  const DECK_SIZE = 119315717514047n;
  const fn1 = parseData(moves, DECK_SIZE);
  const fn = fnAppliedNtimes(fn1, 101741582076661n, DECK_SIZE);
  const [a, b] = fn;

  // Now, we're closer. To end  up at position 2020, we have
  // (a * x + b) % DECK_SIZE === 2020
  //      <=>
  // a * x + b = 2020 + DECK_SIZE * n
  //      <=>
  // a * x - DECK_SIZE * n = 2020 - b
  // with x within 0..DECK_SIZE
  // It's a diophantine equation and can be solved
  // the extended GCD method.

  const [gcd, x] = extendedGcd(a < 0 ? -a : a, DECK_SIZE);
  let x0 = (x * (2020n - b)) / gcd;

  // Now, let's find an x value in the correct range
  x0 = x0 - (x0 / DECK_SIZE) * DECK_SIZE;
  if (x0 < 0) x0 += DECK_SIZE;
  return x0;
}

export default function run(): void {
  const data = readData('day22.txt');
  const answer1 = part1(data);
  const answer2 = part2(data);
  console.log('-- Day 22');
  console.log('The position of card 2019 after one shuffle is', answer1);
  console.log(
    'After having shuffled the HUGE deck, the card ending up in position 2020 is',
    answer2
  );
}
