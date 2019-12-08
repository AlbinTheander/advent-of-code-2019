import { readData } from '../util/file';
import { minBy } from '../util/minBy';

function parseData(s: string): string[] {
  return s.match(/.{150}/g);
}

function part1(layers: string[]): number {
  const count = (layer: string, digit: string): number => layer.match(RegExp(digit, 'g')).length;

  const layer = minBy(layers, layer => count(layer, '0'));
  return count(layer, '1') * count(layer, '2');
}

function part2(layers): string {
  let result = '';
  const getPixel = (i: number): string => {
    for (const layer of layers) if (layer[i] !== '2') return layer[i];
    return '2';
  };

  for (let i = 0; i < 25 * 6; i++) result += getPixel(i);

  return result.match(/.{25}/g).join('\n');
}

export default function run(): void {
  const data = readData('day8.txt');
  const layers = parseData(data);
  const answer1 = part1(layers);
  const answer2 = part2(layers);

  console.log('-- Day 8');
  console.log('The checksum of the image is', answer1);
  console.log('The image:');
  console.log(answer2.replace(/./g, c => (c === '0' ? ' ' : '*')));
}
