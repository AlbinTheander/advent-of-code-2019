import { readData } from '../util/file';

type Move = (size: number, pos: number) => number;

const dealNewStack: Move = (size: number, pos: number): number => size - pos - 1;

const cut = (cards: number): Move => (size: number, pos: number): number => {
  if (cards < 0) return cut(size + cards)(size, pos);
  if (pos < cards) return pos + (size - cards);
  return pos - cards;
};

const dealInc = (inc: number): Move => (size: number, pos: number): number => (pos * inc) % size;

function parseData(s: string): Move[] {
  const moves = s.split('\n').map(line => {
    const num = (line.match(/-?\d+/g) || []).map(Number)[0];
    if (line.includes('cut')) return cut(num);
    if (line.includes('increment')) return dealInc(num);
    return dealNewStack;
  });
  return moves;
}

function makeMoves(moves: Move[], size: number, card: number): number {
  return moves.reduce((pos, move) => move(size, pos), card);
}

function part1(moves: Move[]): number {
  return makeMoves(moves, 10007, 2019);
}

export default function run(): void {
  const data = readData('day22.txt');
  const moves = parseData(data);
  const answer1 = part1(moves);

  console.log('-- Day 22');
  console.log('The position of card 2019 after on shuffle is', answer1);
}
