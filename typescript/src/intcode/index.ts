export type Program = number[];
export type Computer = {
  memory: number[];
  ip: number;
  input: number[];
  output: number[];
  halted: boolean;
  waitingForInput: boolean;
};

export function createComputer(program: Program, input: number[] = []): Computer {
  return {
    memory: program,
    ip: 0,
    input,
    output: [],
    halted: false,
    waitingForInput: false
  };
}

const ADD = 1;
const MUL = 2;
const IN = 3;
const OUT = 4;
const JT = 5;
const JF = 6;
const LT = 7;
const EQ = 8;
const HALT = 99;

const POSITION = 0;
const IMMEDIATE = 1;

export function step(computer: Computer): void {
  const read = (mode: number = POSITION): number => {
    const n = computer.memory[computer.ip++];
    return mode === IMMEDIATE ? n : computer.memory[n];
  };

  const instr = read(IMMEDIATE);
  const op = instr % 100;
  const modes = instr
    .toString(10)
    .slice(0, -2)
    .split('')
    .map(Number)
    .reverse();

  switch (op) {
    case ADD: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      computer.memory[c] = a + b;
      break;
    }
    case MUL: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      computer.memory[c] = a * b;
      break;
    }
    case IN: {
      if (computer.input.length > 0) {
        const a = read(IMMEDIATE);
        computer.memory[a] = computer.input.shift();
      } else {
        computer.ip--;
        computer.waitingForInput = true;
      }
      break;
    }
    case OUT: {
      const a = read(modes[0]);
      computer.output.push(a);
      break;
    }
    case JT: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      if (a !== 0) computer.ip = b;
      break;
    }
    case JF: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      if (a === 0) computer.ip = b;
      break;
    }
    case LT: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      computer.memory[c] = a < b ? 1 : 0;
      break;
    }
    case EQ: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      computer.memory[c] = a === b ? 1 : 0;
      break;
    }
    case HALT: {
      computer.halted = true;
      break;
    }
    default:
      throw Error('Unknown opcode ' + op);
  }
}

/**
 * Will run the computer until it's halted or need more input.
 * @param computer
 */
export function runComputer(computer: Computer): void {
  // Reset input flag if there is any available
  if (computer.waitingForInput && computer.input.length > 0) computer.waitingForInput = false;

  while (!computer.halted && !computer.waitingForInput) step(computer);
}
