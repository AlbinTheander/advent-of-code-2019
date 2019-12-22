const parent = (n: number): number => (n - 1) >> 1;
const left = (n: number): number => 2 * n + 1;
const right = (n: number): number => 2 * n + 2;
const swap = <T>(a: T[], i1: number, i2: number): void => {
  const t1 = a[i1];
  a[i1] = a[i2];
  a[i2] = t1;
};

export class PriorityQueue<T> {
  heap: [T, number][] = [];

  add(t: T, weight: number): void {
    this.heap.push([t, weight]);
    let ti = this.heap.length - 1;
    while (ti > 0) {
      const pi = parent(ti);
      if (this.heap[pi][1] <= weight) break;
      swap(this.heap, ti, pi);
      ti = pi;
    }
  }

  empty(): boolean {
    return this.heap.length === 0;
  }

  take(): T {
    const result = this.heap[0][0];
    if (this.heap.length === 1) {
      this.heap.pop();
      return result;
    }
    let i = 0;
    this.heap[0] = this.heap.pop();
    const w = this.heap[0][1];
    while (i < this.heap.length) {
      const li = left(i);
      const lw = li >= this.heap.length ? Infinity : this.heap[li][1];
      const ri = right(i);
      const rw = ri >= this.heap.length ? Infinity : this.heap[ri][1];
      if (rw < lw && rw < w) {
        swap(this.heap, i, ri);
        i = ri;
      } else if (lw < w) {
        swap(this.heap, i, li);
        i = li;
      } else break;
    }
    return result;
  }
}

export class FPriorityQueue<T> {
  queue = new PriorityQueue<T>();
  weight: (t: T) => number;

  constructor(weight: (t: T) => number) {
    this.weight = weight;
  }

  add(t: T): void {
    this.queue.add(t, this.weight(t));
  }

  empty(): boolean {
    return this.queue.empty();
  }

  take(): T {
    return this.queue.take();
  }
}
