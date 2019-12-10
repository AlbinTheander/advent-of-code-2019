import { readData } from '../util/file';

function parseData(s: string): string[] {
  return s.split('\n');
}

function gcd(a: number, b: number): number {
  if (b === 0) return Math.abs(a); // We always use the positive gcd here. Makes things much easier.
  return gcd(b, a % b);
}

/**
 * This will return a stable angle in all directions as a pair of numbers. I guess it could
 * be translated to an actual angle going clockwise around, but I was too lazy to freshen up
 * my trigonometry.
 */
function angle(fromX: number, fromY: number, toX: number, toY: number): [number, number] {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (dx === 0) return [0, Math.sign(dy)];
  if (dy === 0) return [Math.sign(dx), 0];
  const g = gcd(dx, dy);
  return [dx / g, dy / g];
}

/**
 * Counts the number of visible asteroids from the given position.
 */
function visibleCount(map: string[], x: number, y: number): number {
  const angles = new Set<string>();
  if (map[y][x] === '.') return 0; // Let's just pretend to be blind if this is not a valid place.
  for (let y1 = 0; y1 < map.length; y1++)
    for (let x1 = 0; x1 < map[0].length; x1++)
      if (!(x === x1 && y === y1) && map[y1][x1] !== '.') {
        angles.add(angle(x, y, x1, y1).toString());
      }

  return angles.size;
}

/**
 * Returns [x, y, visibleCount] of the position with the most
 * visible asteroids.
 */
function maxVisible(map: string[]): number[] {
  let best = -Infinity;
  let bestPos = [];
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[0].length; x++) {
      const count = visibleCount(map, x, y);
      if (count > best) {
        best = count;
        bestPos = [x, y];
      }
    }
  return [...bestPos, best];
}

/**
 * Sorry about this function. Maybe I'll tidy it up eventually. (Yeah, right...)
 */
function eliminationOrder(map: string[], baseX: number, baseY: number): [number, number][] {
  // Returns the quadrant like:
  //      4 1
  //       x
  //      3 2
  const quad = (x, y): number => {
    if (x >= 0 && y < 0) return 1;
    if (x > 0 && y >= 0) return 2;
    if (x <= 0 && y > 0) return 3;
    if (x < 0 && y <= 0) return 4;
  };

  const asteroids = [];

  // First, let's collect a bunch of data for each asterioid:
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[0].length; x++)
      if (!(x === baseX && y === baseY) && map[y][x] !== '.') {
        const dx = x - baseX;
        const dy = y - baseY;
        const d = Math.abs(dx) + Math.abs(dy);
        asteroids.push({
          x, // Position
          y,
          dx, // Position relative to the base
          dy,
          angle: Math.abs(dy / dx), // Angle as a ration. It's okay to be +/-Infinity
          dist: d, // Manhattan distance to the base
          quad: quad(dx, dy) // Which quadrant we're in
        });
      }

  // Sort the asteroids after angle clockwise around from the base. For asteroids
  // with the same angle, the cloesest ones come first.
  asteroids.sort((p1, p2) => {
    if (p1.quad !== p2.quad) return p1.quad - p2.quad;
    if (p1.angle !== p2.angle) return p1.quad % 2 === 0 ? p1.angle - p2.angle : p2.angle - p1.angle;
    return p1.dist - p2.dist;
  });

  // Now let's go round and round. If we've used one angle, we can't use it again until the
  // next traversal of the list.
  const result = [];
  let lastAngle = '';
  let i = 0;
  while (!asteroids.every(t => t.done)) {
    const t = asteroids[i];
    if (!t.done && t.angle.toString() !== lastAngle) {
      result.push(t);
      t.done = true;
      lastAngle = t.angle.toString();
    }
    i++;
    if (i === asteroids.length) {
      i = 0;
      lastAngle = '';
    }
  }

  // Just keep the positions.
  return result.map(({ x, y }) => [x, y]);
}

function part1(map: string[]): number {
  const [, , count] = maxVisible(map);
  return count;
}

function part2(map: string[]): [number, number] {
  const [baseX, baseY] = maxVisible(map);
  const order = eliminationOrder(map, baseX, baseY);
  return order[199];
}

export default function run(): void {
  const data = readData('day10.txt');
  const map = parseData(data);
  const answer1 = part1(map);
  const answer2 = part2(map);

  console.log('-- Day 10');
  console.log('The best base can see', answer1, 'asteroids');
  console.log('The 200th asteroid to be blasted into smitherins has coordiate', answer2);
}
