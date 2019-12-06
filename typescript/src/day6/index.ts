import { readData } from '../util/file';

type Node = {
  id: string;
  depth: number;
  children: Node[];
  parents: string[];
};

function buildTree(pairs: [string, string][]): Node {
  const root: Node = { id: 'COM', depth: 0, children: [], parents: [] };
  const leftToHandle = [root];
  while (leftToHandle.length > 0) {
    const next = leftToHandle.pop();
    const children = pairs
      .filter(p => p[0] === next.id)
      .map(p => ({
        id: p[1],
        depth: next.depth + 1,
        children: [],
        parents: next.parents.concat(next.id)
      }));
    leftToHandle.push(...children);
    next.children = children;
  }
  return root;
}

function parseData(s: string): Node {
  const pairs = s
    .split('\n')
    .filter(Boolean)
    .map(line => line.trim().split(')')) as [string, string][];
  return buildTree(pairs);
}

function forEachNode(node: Node, f: (n: Node) => any): void {
  f(node);
  node.children.forEach(c => forEachNode(c, f));
}

function findNode(root: Node, id: string): Node {
  if (root.id === id) return root;
  for (const child of root.children) {
    const result = findNode(child, id);
    if (result) return result;
  }
}

function part1(root: Node): number {
  let count = 0;
  forEachNode(root, node => (count += node.depth));
  return count;
}

function part2(root: Node): number {
  const you = findNode(root, 'YOU');
  const santa = findNode(root, 'SAN');
  const commonNodeId = you.parents
    .slice()
    .reverse()
    .find(id => santa.parents.includes(id));
  const common = findNode(root, commonNodeId);
  return you.depth - common.depth - 1 + (santa.depth - common.depth - 1);
}

export default function run(): void {
  const root = parseData(readData('day6.txt'));
  const answer1 = part1(root);
  const answer2 = part2(root);

  console.log('-- Day6');
  console.log('Total number of orbits is', answer1);
  console.log('Number of hops to reach Santa', answer2);
}
