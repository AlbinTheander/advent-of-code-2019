/**
 * Generate all permutations of the given array. If the input array is
 * sorted, the permutations will be return in a "sorted" manner.
 * For example, with the input [1, 2, 3], the returned permutations will
 * be: [1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]
 *
 * @param ts array of elements to create permutations from.
 */
export function* permutations<T>(ts: T[]): Generator<T[], undefined, undefined> {
  const without = (n: number): T[] => ts.slice(0, n).concat(ts.slice(n + 1));
  if (ts.length === 1) return yield ts;

  for (let i = 0; i < ts.length; i++) {
    const head = ts[i];
    const rest = without(i);
    for (const restPerm of permutations(rest)) yield [head, ...restPerm];
  }
}
