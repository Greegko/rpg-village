import { baseRandom } from './base-random';

export function sample<T>(array: T[]): T {
  var length = array.length;
  return array[baseRandom(0, length - 1)];
}
