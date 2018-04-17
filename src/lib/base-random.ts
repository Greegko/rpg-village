export function baseRandom(lower: number, upper: number): number {
  return lower + ~~(Math.random() * (upper - lower + 1));
}
