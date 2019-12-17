export type Program = number[];
export type Computer = {
  memory: number[];
  ip: number;
  base: number;
  input: number[];
  output: number[];
  halted: boolean;
  waitingForInput: boolean;
};

export function createComputer(program: Program, input: number[] = []): Computer {
  return {
    memory: program.slice(),
    ip: 0,
    base: 0,
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
const BASE = 9;
const HALT = 99;

const POSITION = 0;
const IMMEDIATE = 1;
const RELATIVE = 2;

export function step(computer: Computer): void {
  const read = (mode: number = POSITION): number => {
    const n = computer.memory[computer.ip++];
    switch (mode) {
      case IMMEDIATE:
        return n;
      case RELATIVE:
        return computer.memory[n + computer.base] || 0;
      default:
        return computer.memory[n] || 0;
    }
  };
  const store = (adr: number, value: number, mode: number = POSITION): void => {
    const target = mode === RELATIVE ? adr + computer.base : adr;
    computer.memory[target] = value;
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
      store(c, a + b, modes[2]);
      break;
    }
    case MUL: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      store(c, a * b, modes[2]);
      break;
    }
    case IN: {
      if (computer.input.length > 0) {
        const a = read(IMMEDIATE);
        store(a, computer.input.shift(), modes[0]);
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
      store(c, a < b ? 1 : 0, modes[2]);
      break;
    }
    case EQ: {
      const a = read(modes[0]);
      const b = read(modes[1]);
      const c = read(IMMEDIATE);
      store(c, a === b ? 1 : 0, modes[2]);
      break;
    }
    case BASE: {
      const a = read(modes[0]);
      computer.base += a;
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
