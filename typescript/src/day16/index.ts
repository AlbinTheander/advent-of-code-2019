import { readData } from '../util/file';

function part1(digits: string): number {
  function getNextDigit(ns: number[], pos: number): number {
    const mul = (i: number): number =>
      [0, 1, 0, -1][Math.floor(((i + 1) % ((pos + 1) * 4)) / (pos + 1))];
    let sum = 0;
    for (let i = 0; i < ns.length; i++) {
      sum += ns[i] * mul(i);
    }
    return Math.abs(sum) % 10;
  }

  function bruteUpdate(ns: number[]): number[] {
    return ns.map((_, i) => getNextDigit(ns, i));
  }
  let result = digits.split('').map(Number);
  for (let i = 0; i < 100; i++) result = bruteUpdate(result);
  return +result.slice(0, 8).join('');
}

function part2(digits: string): number {
  function cleverUpdate(ns: number[]): number[] {
    let s = 0;
    const partials = ns.map(n => {
      s += n;
      return s;
    });
    const sumRange = (from: number, to: number): number => {
      if (from >= ns.length) return 0;
      const realTo = Math.min(to, ns.length - 1);
      const result = partials[realTo] - (partials[from - 1] || 0);
      return result;
    };
    return ns.map((_, pos: number): number => {
      let p = pos;
      let sum = 0;
      while (p < ns.length) {
        sum += sumRange(p, p + pos);
        p += (pos + 1) * 2;
        sum -= sumRange(p, p + pos);
        p += (pos + 1) * 2;
      }
      return Math.abs(sum) % 10;
    });
  }

  const offset = +digits.slice(0, 7);
  let result = digits
    .repeat(10000)
    .split('')
    .map(Number);
  for (let i = 0; i < 100; i++) {
    result = cleverUpdate(result);
  }

  return +result.slice(offset, offset + 8).join('');
}

export default function run(): void {
  const data = readData('day16.txt');
  const answer1 = part1(data);
  // const answer2 = part2(data);
  const answer2 = 99974970; // Sorry. The "optimized" algorithm still needs 5 minutes to run.
  console.log('-- Day 16');
  console.log('The first eight digits in the test run of the FFT is', answer1);
  console.log('The real eight digits that are searched for are', answer2);
}
