export function minBy<T>(xs: T[], weight: (x: T) => number): T {
  let best = null;
  let bestWeight = Infinity;
  for (const x of xs) {
    const w = weight(x);
    if (w < bestWeight) {
      best = x;
      bestWeight = w;
    }
  }
  return best;
}
