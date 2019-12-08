import { readData } from '../util/file';

function decode(layers: string[]): string {
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
  const layers = data.match(/.{150}/g);
  const withCount = layers.map(l => ({ layer: l, count: l.match(/0/g).length }));
  const minCount = Math.min(...withCount.map(lc => lc.count));
  const minLayer = withCount.find(lc => lc.count === minCount).layer;
  const ones = minLayer.match(/1/g).length;
  const twos = minLayer.match(/2/g).length;
  console.log(ones, twos, ones * twos);
  console.log(decode(layers).replace(/0/g, ' '));
}
