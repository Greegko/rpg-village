export function withoutBy<T>(arr: T[], arr2: T[], hashFn: (value: T) => any): T[] {
  const arr2Hash = arr2.map(hashFn);

  return arr.filter(value => !arr2Hash.includes(hashFn(value)));
}
