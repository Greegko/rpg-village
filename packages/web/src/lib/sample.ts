export function sample<T>(array: T[]): T {
  var length = array.length;
  return length ? array[baseRandom(0, length - 1)] : undefined;
}

export function baseRandom(lower, upper) {
  return lower + ~~(Math.random() * (upper - lower + 1));
}
