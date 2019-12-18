import { readData } from '../util/file';

type Maze = string[];
type Coord = { x: number; y: number };
type Path = { dist: number; doors: string };

const KEYS = 'abcdefghijklmnopqrstuvwxyz';
const DOORS = KEYS.toUpperCase();

function findInMaze(maze: Maze, key: string): Coord | null {
  const y = maze.findIndex(line => line.includes(key));
  if (y === -1) return null;
  const x = maze[y].indexOf(key);
  if (x === -1) return null;
  return { x, y };
}

function parseData(s: string): { maze: Maze; pos: Coord } {
  const maze = s.split('\n');
  const pos = findInMaze(maze, '@');
  maze[pos.y] = maze[pos.y].replace('@', '.');
  return { maze, pos };
}

export function findAllKeysFrom(maze: Maze, pos: Coord): Map<string, Path> {
  const distances: number[][] = maze.map(line => Array(line.length).fill(Infinity));
  const keys = new Map<string, Path>();

  function walk(x: number, y: number, dist: number, doors: string): void {
    const room = maze[y][x];
    let newDoors = doors;
    if (room === '#') return;
    if (dist >= distances[y][x]) return;
    distances[y][x] = dist;
    if (DOORS.includes(room)) newDoors += room;
    if (KEYS.includes(room)) {
      keys.set(room, { dist, doors });
    }
    walk(x + 1, y, dist + 1, newDoors);
    walk(x - 1, y, dist + 1, newDoors);
    walk(x, y + 1, dist + 1, newDoors);
    walk(x, y - 1, dist + 1, newDoors);
  }

  walk(pos.x, pos.y, 0, '');
  return keys;
}

function findKeyPaths(maze: Maze): Map<string, Map<string, Path>> {
  const keyMap = new Map<string, Map<string, Path>>();
  for (const key of KEYS) {
    const pos = findInMaze(maze, key);
    if (!pos) continue;
    const map = findAllKeysFrom(maze, pos);
    keyMap.set(key, map);
  }
  return keyMap;
}

function replace<T>(ts: T[], pos: number, newT: T): T[] {
  return ts.map((t, i) => (i === pos ? newT : t));
}

function findShortestPath2(keyPaths: Map<string, Map<string, Path>>, startKeys: string): number {
  const memoMap = new Map<string, [number, string]>();
  function getMemo(robots: string[], foundKeys: string): [number, string] {
    const key = robots.toString() + [...foundKeys].sort();
    return memoMap.get(key);
  }
  function setMemo(robots: string[], foundKeys: string, result: [number, string]): void {
    const key = robots.toString() + [...foundKeys].sort();
    memoMap.set(key, result);
  }
  function findFrom(robots: string[], foundKeys: string): [number, string] {
    if (foundKeys.length === keyPaths.size) return [0, ''];
    if (getMemo(robots, foundKeys)) return getMemo(robots, foundKeys);
    let minDist = Infinity;
    let minPath = '';
    for (let i = 0; i < robots.length; i++) {
      const atKey = robots[i];
      const allPaths = keyPaths.get(atKey);
      const possibleKeys = [...allPaths.keys()]
        .filter(key => !foundKeys.includes(key))
        .filter(key => key !== atKey)
        .filter(key =>
          [...allPaths.get(key).doors].every(door => foundKeys.includes(door.toLowerCase()))
        );
      for (const nextKey of possibleKeys) {
        const newRobots = replace(robots, i, nextKey);
        const newFoundKeys = foundKeys + nextKey;
        const [dist, path] = findFrom(newRobots, newFoundKeys);
        const totalDist = dist + allPaths.get(nextKey).dist;
        if (totalDist < minDist) {
          minDist = totalDist;
          minPath = nextKey + path;
        }
      }
    }
    setMemo(robots, foundKeys, [minDist, minPath]);
    return [minDist, minPath];
  }

  const result = findFrom(startKeys.split(''), startKeys);
  return result[0];
}

function part1(maze: Maze, pos: Coord): number {
  const keyPaths = findKeyPaths(maze);
  keyPaths.set('@', findAllKeysFrom(maze, pos));
  const result = findShortestPath2(keyPaths, '@');
  return result;
}

function part2(maze: Maze, pos: Coord): number {
  const splitMaze = maze.map(line => line.split(''));
  const { x, y } = pos;
  splitMaze[y][x] = '#';
  splitMaze[y][x + 1] = '#';
  splitMaze[y][x - 1] = '#';
  splitMaze[y + 1][x] = '#';
  splitMaze[y - 1][x] = '#';
  const maze2 = splitMaze.map(line => line.join(''));
  const keyPaths = findKeyPaths(maze2);
  keyPaths.set('1', findAllKeysFrom(maze2, { x: x + 1, y: y + 1 }));
  keyPaths.set('2', findAllKeysFrom(maze2, { x: x - 1, y: y + 1 }));
  keyPaths.set('3', findAllKeysFrom(maze2, { x: x + 1, y: y - 1 }));
  keyPaths.set('4', findAllKeysFrom(maze2, { x: x - 1, y: y - 1 }));
  const result = findShortestPath2(keyPaths, '1234');
  return result;
}

export default function run(): void {
  const data = readData('day18.txt');
  const { maze, pos } = parseData(data);
  const answer1 = part1(maze, pos);
  const answer2 = part2(maze, pos);

  console.log('-- Day 18');
  console.log('The shortest path to collect all keys is', answer1);
  console.log('The shortest path to get all keys with four robots is', answer2);
}
