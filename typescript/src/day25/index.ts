import { Program, createComputer, runComputer } from '../intcode';
import { createInterface } from 'readline';
import { readData } from '../util/file';

function parseData(s: string): Program {
  return s.split(',').map(Number);
}

function runInteractively(program: Program, cmds: string): void {
  const repl = createInterface({ input: process.stdin, output: process.stdout });
  const computer = createComputer(
    program,
    cmds.split('').map(ch => ch.charCodeAt(0))
  );

  const runNext = (input: string): void => {
    computer.input.push(...input.split('').map(ch => ch.charCodeAt(0)));
    runComputer(computer);
    console.log(computer.output.map(d => String.fromCharCode(d)).join(''));
    computer.output.splice(0, computer.output.length);
  };

  const askQuestion = (): void => {
    repl.question('> ', answer => {
      runNext(answer + '\n');
      if (computer.halted) {
        repl.close();
        return;
      }
      askQuestion();
    });
  };

  runNext('');
  askQuestion();
}

// Let's go around and pick up everyting we find. The instructions
// were found by playing the game interactively.
const cmds = `south
take fixed point
north
west
west
west
take hologram
east
east
east
north
take candy cane
west
take antenna
west
take shell
east
south
take whirled peas
north
east
north
north
take polygon
south
west
take fuel cell
west
west
inv
`;

function* thingCombinations(): Generator<string[], undefined, undefined> {
  const things = [
    'hologram',
    'shell',
    'whirled peas',
    'fuel cell',
    'fixed point',
    'polygon',
    'antenna',
    'candy cane'
  ];
  for (let i = 0; i <= 2 ** things.length - 1; i++) {
    yield i
      .toString(2)
      .padStart(8, '0')
      .split('')
      .map((d, i) => +d && things[i])
      .filter(Boolean);
  }

  return;
}

function findCombination(program: Program): string {
  for (const things of thingCombinations()) {
    const commands = cmds
      .split('\n')
      .filter(cmd => !cmd.startsWith('take') || things.some(thing => cmd.includes(thing)))
      .join('\n');

    const computer = createComputer(
      program,
      commands.split('').map(ch => ch.charCodeAt(0))
    );
    runComputer(computer);
    const output = computer.output.map(d => String.fromCharCode(d)).join('');
    const pos = output.lastIndexOf('== ');
    const pos2 = output.indexOf('\n', pos);
    const room = output.slice(pos, pos2);
    if (room !== '== Security Checkpoint ==') {
      // Return the last printed number.
      const result = output.match(/\d+/g).pop();
      return result;
    }
  }
}

export default function run(): void {
  const program = parseData(readData('day25.txt'));
  const answer1 = findCombination(program);

  console.log('-- Day 25');
  console.log('The password combination is', answer1);
  // runInteractively(program, '');
}
