import { readFileSync } from 'fs';

function parseData(s: string): number[] {
  return s
    .split('\n')
    .filter(Boolean)
    .map(Number);
}

function simpleFuelRequired(mass: number): number {
  const fuel = Math.floor(mass / 3) - 2;
  return Math.max(0, fuel);
}

function fuelRequired(mass: number): number {
  const fuel = Math.floor(mass / 3) - 2;
  if (fuel <= 0) return 0;
  const fuelForFuel = fuelRequired(fuel);
  return fuel + fuelForFuel;
}

function part1(modules: number[]): number {
  return modules.map(simpleFuelRequired).reduce((a, b) => a + b);
}

function part2(modules: number[]): number {
  return modules.map(fuelRequired).reduce((a, b) => a + b);
}

export default function run(): void {
  const modules = parseData(readFileSync('./data/day1.txt', 'utf-8'));

  console.log('-- Day 1');
  console.log('The estimated amount of fuel is', part1(modules));
  console.log('The correctly estimated amount of fuel is', part2(modules));
}
