import { Program, createComputer, runComputer } from '../intcode';
import { readData } from '../util/file';

function parseData(s: string): Program {
  return s.split(',').map(Number);
}

function runSpringCode(intCode: Program, springCode: string): number[] {
  const input = [...springCode].map(ch => ch.charCodeAt(0));
  const computer = createComputer(intCode, input);
  runComputer(computer);
  return computer.output;
}

function part1(droid: Program): number {
  // There is a bit of though behind this. If there is a hole in any of the three following
  // positions and we can land after that, jump. Otherwise not.
  const springCode = `OR C J
AND A J
AND B J
NOT J J
AND D J
WALK
`;
  const output = runSpringCode(droid, springCode);
  return output.pop();
}

function part2(droid: Program): number {
  // This is just adding things on top of part 1. It was mostly a process of trial and
  // error. Wish I had something more clever to come with.
  const springCode = `OR C T
AND A T
AND B T
NOT T T
AND D T
OR E J
OR H J
AND T J
RUN
`;
  const output = runSpringCode(droid, springCode);
  return output.pop();
}

export default function run(): void {
  const droidCode = parseData(readData('day21.txt'));
  const answer1 = part1(droidCode);
  const answer2 = part2(droidCode);

  console.log('-- Day 21');
  console.log('Hull damage when inspecting walking:', answer1);
  console.log('Hull damage when inspecting running:', answer2);
}
