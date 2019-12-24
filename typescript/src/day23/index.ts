import { readData } from '../util/file';
import { createComputer, runComputer, Program } from '../intcode';

function parseData(s: string): Program {
  return s.split(',').map(Number);
}

function part1And2(program: Program): [number, number] {
  const computers = Array(50)
    .fill(0)
    .map((_, i) => createComputer(program, [i]));
  computers.forEach(c => runComputer(c));

  let nat = [-1, -1];
  let lastSendYTo0 = NaN;
  let firstYToNat = NaN;
  while (true) {
    let idle = true;
    computers.forEach(c => {
      if (c.input.length === 0) c.input.push(-1);
      runComputer(c);
      while (c.output.length > 0) {
        idle = false;
        const adr = c.output.shift();
        const x = c.output.shift();
        const y = c.output.shift();
        if (adr === 255) {
          if (isNaN(firstYToNat)) firstYToNat = y;
          nat = [x, y];
        } else {
          computers[adr].input.push(x, y);
        }
      }
    });
    if (idle) {
      if (lastSendYTo0 === nat[1]) {
        return [firstYToNat, lastSendYTo0];
      }
      lastSendYTo0 = nat[1];
      computers[0].input.push(...nat);
    }
  }
}

export default function run(): void {
  const program = parseData(readData('day23.txt'));
  const [answer1, answer2] = part1And2(program);

  console.log('-- Day 23');
  console.log('The first Y value sent to the NAT is', answer1);
  console.log('The first Y value sent twice in a row to NIC 0 is', answer2);
}
