import { KeyedMap } from '../util/KeyedMap';
import { readData } from '../util/file';
import { FPriorityQueue } from '../util/PriorityQueue';

type Coord = [number, number];
type Maze = {
  grid: string[];
  portals: Map<string, Coord>;
  portalCoords: KeyedMap<Coord, string>;
};

const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function parseData(s: string): Maze {
  const grid = s.split('\n');
  const portals = new Map<string, Coord>();
  const portalCoords = new KeyedMap<Coord, string>(c => c.toString());
  for (let y = 0; y < grid.length; y++)
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== '.') continue;
      let portalId = '';
      if (AZ.includes(grid[y - 1][x])) {
        portalId = [grid[y - 1][x], grid[y - 2][x]].sort().join('');
      }
      if (AZ.includes(grid[y + 1][x])) {
        portalId = [grid[y + 1][x], grid[y + 2][x]].sort().join('');
      }
      if (AZ.includes(grid[y][x - 1])) {
        portalId = [grid[y][x - 1], grid[y][x - 2]].sort().join('');
      }
      if (AZ.includes(grid[y][x + 1])) {
        portalId = [grid[y][x + 1], grid[y][x + 2]].sort().join('');
      }
      if (portalId) {
        const suffix = x < 5 || y < 5 || grid[y].length - x < 5 || grid.length - y < 5 ? '-' : '+';
        portals.set(portalId + suffix, [x, y]);
        portalCoords.set([x, y], portalId + suffix);
      }
    }
  return { grid, portals, portalCoords };
}

function findPortals(maze: Maze, start: string): [string, number][] {
  const { grid, portals, portalCoords } = maze;
  const distances = new KeyedMap<Coord, number>(c => c.toString());
  const [startX, startY] = portals.get(start);
  const reached = [];
  const toCheck = [{ x: startX, y: startY, distance: 0 }];
  while (toCheck.length > 0) {
    const { x, y, distance } = toCheck.shift();
    if (grid[y][x] !== '.') continue;
    if (distances.has([x, y])) continue;

    distances.set([x, y], distance);
    const portalId = portalCoords.get([x, y]);
    if (portalId && portalId !== start) {
      reached.push([portalId, distance]);
    }
    toCheck.push({ x: x + 1, y, distance: distance + 1 });
    toCheck.push({ x: x - 1, y, distance: distance + 1 });
    toCheck.push({ x, y: y + 1, distance: distance + 1 });
    toCheck.push({ x, y: y - 1, distance: distance + 1 });
  }

  return reached;
}

function findDistance(maze: Maze): number {
  const { portals } = maze;
  const portalMap = new Map<string, [string, number][]>();
  for (const p of portals.keys()) {
    portalMap.set(p, findPortals(maze, p));
  }

  const toCheck = new FPriorityQueue<{
    portal: string;
    distance: number;
    path: string[];
  }>(t => t.distance);
  toCheck.add({ portal: 'AA-', distance: 0, path: ['AA-'] });
  let rounds = 0;
  while (!toCheck.empty() && rounds++ < 10000000) {
    const { portal, distance, path } = toCheck.take();
    if (portal.startsWith('ZZ')) {
      // If we reached ZZ return the total distance
      // (Remove 1, since we weren't suppose to go through the portal)
      return distance - 1;
    }
    const nextPortals = portalMap.get(portal);
    if (!nextPortals) continue;
    for (const [nextPortal, nextDistance] of nextPortals) {
      const otherSide = nextPortal.slice(0, 2) + (nextPortal.endsWith('+') ? '-' : '+');
      toCheck.add({
        portal: otherSide,
        distance: distance + nextDistance + 1,
        path: path.concat(nextPortal)
      });
    }
  }
  return -1;
}

function findRecursiveDistance(maze: Maze): number {
  const { portals } = maze;
  const portalMap = new Map<string, [string, number][]>();
  for (const p of portals.keys()) {
    portalMap.set(p, findPortals(maze, p));
  }

  const toCheck = new FPriorityQueue<{
    portal: string;
    level: number;
    distance: number;
    path: string[];
  }>(t => t.distance * 1000 + t.level);
  toCheck.add({ portal: 'AA-', level: 0, distance: 0, path: ['AA-'] });
  let rounds = 0;
  while (!toCheck.empty() && rounds++ < 10000000) {
    const { portal, level, distance, path } = toCheck.take();
    if (portal.startsWith('ZZ')) {
      // If we reached ZZ return the total distance
      // (Remove 1, since we weren't suppose to go through the portal)
      if (level === -1) return distance - 1;
    }
    const nextPortals = portalMap.get(portal);
    if (!nextPortals) continue;
    for (const [nextPortal, nextDistance] of nextPortals) {
      if (level === 0 && nextPortal.endsWith('-') && !nextPortal.startsWith('ZZ')) continue;
      const otherSide = nextPortal.slice(0, 2) + (nextPortal.endsWith('+') ? '-' : '+');
      const nextLevel = nextPortal.endsWith('+') ? level + 1 : level - 1;
      toCheck.add({
        portal: otherSide,
        level: nextLevel,
        distance: distance + nextDistance + 1,
        path: path.concat(nextPortal + `(${nextLevel})`)
      });
    }
  }
  return -1;
}

export default function run(): void {
  const data = readData('day20.txt');
  const maze = parseData(data);
  const answer1 = findDistance(maze);
  const answer2 = findRecursiveDistance(maze);

  console.log('-- Day 20');
  console.log('Distance to ZZ is', answer1);
  console.log('The recursive space distance to ZZ is', answer2);
}
