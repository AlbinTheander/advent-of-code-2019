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
  const { grid, portals, portalCoords } = maze;
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
    if (level < 0) console.log(portal, level, distance, path);
    // console.log(portal, level, distance, path);
    if (portal.startsWith('ZZ')) {
      // console.log('ZZ', level, distance, path);
      if (level === -1) return distance;
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
  const data = `
             Z L X W       C                 
             Z P Q B       K                 
  ###########.#.#.#.#######.###############  
  #...#.......#.#.......#.#.......#.#.#...#  
  ###.#.#.#.#.#.#.#.###.#.#.#######.#.#.###  
  #.#...#.#.#...#.#.#...#...#...#.#.......#  
  #.###.#######.###.###.#.###.###.#.#######  
  #...#.......#.#...#...#.............#...#  
  #.#########.#######.#.#######.#######.###  
  #...#.#    F       R I       Z    #.#.#.#  
  #.###.#    D       E C       H    #.#.#.#  
  #.#...#                           #...#.#  
  #.###.#                           #.###.#  
  #.#....OA                       WB..#.#..ZH
  #.###.#                           #.#.#.#  
CJ......#                           #.....#  
  #######                           #######  
  #.#....CK                         #......IC
  #.###.#                           #.###.#  
  #.....#                           #...#.#  
  ###.###                           #.#.#.#  
XF....#.#                         RF..#.#.#  
  #####.#                           #######  
  #......CJ                       NM..#...#  
  ###.#.#                           #.###.#  
RE....#.#                           #......RF
  ###.###        X   X       L      #.#.#.#  
  #.....#        F   Q       P      #.#.#.#  
  ###.###########.###.#######.#########.###  
  #.....#...#.....#.......#...#.....#.#...#  
  #####.#.###.#######.#######.###.###.#.#.#  
  #.......#.......#.#.#.#.#...#...#...#.#.#  
  #####.###.#####.#.#.#.#.###.###.#.###.###  
  #.......#.....#.#...#...............#...#  
  #############.#.#.###.###################  
               A O F   N                     
               A A D   M                     `;
  const data2 = readData('day20.txt');
  // console.log(data);
  const maze = parseData(data2);
  const answer1 = findDistance(maze);
  console.log('-- Day 20');
  console.log('Distance to ZZ is', answer1);
}
