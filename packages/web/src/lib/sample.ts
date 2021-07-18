export function sample<T>(array: T[]): T {
  var length = array.length;
  return array[baseRandom(0, length - 1)];
}

export function baseRandom(lower: number, upper: number) {
  return lower + ~~(Math.random() * (upper - lower + 1));
}
