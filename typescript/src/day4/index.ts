import { readData } from '../util/file';

function parseData(s: string): number[] {
  return s.match(/\d+/g).map(Number);
}

const hasDoubleDigit = (n: number): boolean =>
  [...n.toString()].some((_, i, chs) => i !== 0 && chs[i] === chs[i - 1]);

const hasExactlyDoubleDigit = (n: number): boolean =>
  n
    .toString()
    .match(/(.)\1*/g)
    .some(group => group.length === 2);

const isInOrder = (n: number): boolean =>
  [...n.toString()].every((_, i, chs) => i === 0 || chs[i] >= chs[i - 1]);

function* numbers(from: number, to: number): Generator<number, undefined, undefined> {
  for (let i = from; i <= to; i++) yield i;
  return;
}

export default function run(): void {
  const [min, max] = parseData(readData('day4.txt'));
  const answer1 = [...numbers(min, max)].filter(hasDoubleDigit).filter(isInOrder);
  const answer2 = [...numbers(min, max)].filter(hasExactlyDoubleDigit).filter(isInOrder);

  console.log('-- Day 4');
  console.log('The number of valid passwords is', answer1.length);
  console.log('The number of strict passwords is', answer2.length);
}
