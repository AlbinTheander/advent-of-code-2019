import { readFileSync } from 'fs';

function parseData(s: string): number[] {
  return s.match(/[-\d]+/g).map(Number);
}

function execute(memory: number[]): void {
  let ip = 0;
  const ADD = 1;
  const MUL = 2;
  const HALT = 99;
  while (memory[ip] !== HALT) {
    const op = memory[ip++];
    const a = memory[ip++];
    const b = memory[ip++];
    const c = memory[ip++];
    switch (op) {
      case ADD:
        memory[c] = memory[a] + memory[b];
        break;
      case MUL:
        memory[c] = memory[a] * memory[b];
        break;
      default:
        throw Error('Unknown opcode ' + op);
    }
  }
}

function part1(original: number[]): number {
  const memory = original.slice();
  memory[1] = 12;
  memory[2] = 2;
  execute(memory);
  return memory[0];
}

function part2(data: number[]): number {
  for (let noun = 0; noun < 100; noun++)
    for (let verb = 0; verb < 100; verb++) {
      const memory = data.slice();
      memory[1] = noun;
      memory[2] = verb;
      execute(memory);
      if (memory[0] === 19690720) {
        return noun * 100 + verb;
      }
    }
  return -1;
}

export default function run(): void {
  const data = parseData(readFileSync('./data/day2.txt', 'utf-8'));
  const answer1 = part1(data);
  const answer2 = part2(data);
  console.log('-- Day 2');
  console.log('The value left at address 0 is', answer1);
  console.log('The magical value to get 19690720 is', answer2);
}
