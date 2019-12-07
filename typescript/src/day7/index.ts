import { createComputer, runComputer } from '../intcode';
import { readData } from '../util/file';
import { permutations } from '../util/permutations';

function parseData(s: string): number[] {
  return s.split(',').map(Number);
}

function runSequence(program: number[], phaseSettings: number[]): number {
  let phaseInput = 0;
  for (const phaseSetting of phaseSettings) {
    const input = [phaseSetting, phaseInput];
    const computer = createComputer(program.slice(), input);
    runComputer(computer);
    phaseInput = computer.output[0];
  }
  return phaseInput;
}

function runSequenceInLoop(program: number[], phaseSettings: number[]): number {
  // Create computers and wire them so the output of one is the input of the next
  let input = [];
  const computers = phaseSettings.map(() => {
    const computer = createComputer(program.slice(), input);
    input = computer.output;
    return computer;
  });
  computers[0].input = computers[computers.length - 1].output;
  // Put in the start settings
  computers.forEach((computer, i) => computer.input.push(phaseSettings[i]));
  // And the initial input
  computers[0].input.push(0);
  // Now we run while there are some non-halted computers. Fingers crossed!
  while (!computers[computers.length - 1].halted) {
    computers.forEach((comp, i) => {
      if (!comp.halted) runComputer(comp);
    });
  }

  return computers[computers.length - 1].output[0];
}

function part1(program: number[]): number {
  let bestSeq = [];
  let bestResult = -Infinity;
  for (const seq of permutations([0, 1, 2, 3, 4])) {
    const result = runSequence(program, seq);
    if (result > bestResult) {
      bestResult = result;
      bestSeq = seq;
    }
  }
  return bestResult;
}

function part2(program: number[]): number {
  let bestSeq = [];
  let bestResult = -Infinity;
  for (const seq of permutations([5, 6, 7, 8, 9])) {
    const result = runSequenceInLoop(program, seq);
    if (result > bestResult) {
      bestResult = result;
      bestSeq = seq;
    }
  }
  return bestResult;
}

export default function run(): void {
  const data = parseData(readData('day7.txt'));
  const answer1 = part1(data);
  const answer2 = part2(data);

  console.log('-- Day 7');
  console.log('The maximum thruster signal is', answer1);
  console.log('The maximum thruster signal with feedback is', answer2);
}
