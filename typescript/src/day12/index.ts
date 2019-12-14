import { readData } from '../util/file';
import { KeyedMap } from '../util/KeyedMap';

type Vector3D = [number, number, number];
type Moon = [Vector3D, Vector3D];

function parseData(s: string): Moon[] {
  return s.split('\n').map(line => {
    const pos = line.match(/[-\d]+/g).map(Number) as Vector3D;
    return [pos, [0, 0, 0]];
  });
}

function velocityChange(moon1: Moon, moon2: Moon): Vector3D {
  return moon1[0].map((_, i) => Math.sign(moon1[0][i] - moon2[0][i])) as Vector3D;
}

function neg(v: Vector3D): Vector3D {
  return v.map(x => -x) as Vector3D;
}

function vplus(v1: Vector3D, v2: Vector3D): Vector3D {
  return v1.map((_, i) => v1[i] + v2[i]) as Vector3D;
}

function vminus(v1: Vector3D, v2: Vector3D): Vector3D {
  return vplus(v1, neg(v2));
}

function tick(moons: Moon[]): void {
  for (let m1 = 0; m1 < moons.length; m1++)
    for (let m2 = m1 + 1; m2 < moons.length; m2++) {
      const dv = velocityChange(moons[m1], moons[m2]);
      moons[m1][1] = vminus(moons[m1][1], dv);
      moons[m2][1] = vplus(moons[m2][1], dv);
    }

  moons.forEach(moon => (moon[0] = vplus(moon[0], moon[1])));
}

function findPeriods(originalMoons: Moon[]): number[] {
  const periods = [];
  for (let coord = 0; coord <= 2; coord++) {
    const moons = JSON.parse(JSON.stringify(originalMoons)) as Moon[];
    const target = moons.map(m => [m[0][coord], m[1][coord]]).toString();
    const atTarget = (): boolean =>
      moons.map(m => [m[0][coord], m[1][coord]]).toString() === target;
    let ticks = 0;
    do {
      ticks++;
      tick(moons);
    } while (!atTarget());
    periods.push(ticks);
  }
  return periods;
}

function energy(moons: Moon[]): number {
  const vEnergy = (v: Vector3D): number => v.reduce((sum, x) => sum + Math.abs(x), 0);
  return moons.reduce((sum, m) => sum + vEnergy(m[0]) * vEnergy(m[1]), 0);
}

function part1(originalMoons: Moon[]): number {
  const moons = JSON.parse(JSON.stringify(originalMoons)) as Moon[];
  for (let i = 0; i < 1000; i++) tick(moons);
  return energy(moons);
}

export default function run(): void {
  const data = readData('day12.txt');
  const moons = parseData(data);
  const answer1 = part1(moons);
  const answer2 = findPeriods(moons);

  // Well answer2 gives the periods for each axis. The real answer is the lcm between these
  // I'll return and add that later. Promise!
  console.log('-- Day 12');
  console.log('The initial energy in the system is', answer1);
  console.log('The period of the whole system is the lcm of', answer2.join(' '));
}
