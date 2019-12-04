import { readData } from '../util/file';

type Step = { direction: string; length: number };
type Wire = Step[];
type Coordinate = [number, number];

function parseData(s: string): Wire[] {
  return s
    .split('\n')
    .filter(Boolean)
    .map(line => line.split(',').map(s => ({ direction: s[0], length: +s.slice(1) })));
}

const DIRECTIONS = { U: [0, 1], R: [1, 0], D: [0, -1], L: [-1, 0] };

function* points(wire: Wire): Generator<Coordinate, undefined, undefined> {
  let x = 0;
  let y = 0;

  for (const step of wire) {
    const [dx, dy] = DIRECTIONS[step.direction];
    for (let l = 0; l < step.length; l++) {
      x += dx;
      y += dy;
      yield [x, y];
    }
  }
  return;
}

function getCollisions([wire1, wire2]: Wire[]): Coordinate[] {
  const wire1Coords = new Set([...points(wire1)].map(s => s.toString()));
  const wire2Coords = [...points(wire2)];
  return wire2Coords.filter(c => wire1Coords.has(c.toString()));
}

function part1(wires: Wire[]): number {
  const collisions = getCollisions(wires);

  return Math.min(...collisions.map(([x, y]) => Math.abs(x) + Math.abs(y)));
}

function part2(wires: Wire[]): number {
  const collisions = getCollisions(wires);
  const collisionMap = collisions.reduce(
    (m, c) => m.set(c.toString(), { c, w1: Infinity, w2: Infinity }),
    new Map<string, { c: Coordinate; w1: number; w2: number }>()
  );

  [...points(wires[0])].forEach((p, n) => {
    const ps = p.toString();
    const coll = collisionMap.get(ps);
    if (coll && n < coll.w1) {
      coll.w1 = n;
    }
  });

  [...points(wires[1])].forEach((p, n) => {
    const ps = p.toString();
    const coll = collisionMap.get(ps);
    if (coll && n < coll.w2) {
      coll.w2 = n;
    }
  });
  const distances = [...collisionMap.values()].map(c => c.w1 + c.w2);
  return Math.min(...distances) + 2; // +2 since we don't count the origin for either wire
}

export default function run(): void {
  const data = parseData(readData('day3.txt'));
  const answer1 = part1(data);
  const answer2 = part2(data);

  console.log('-- Day 3');
  console.log('The distance to the collision closest to the starting point is', answer1);
  console.log('The shortest distance along the wires to a collision is', answer2);
}
