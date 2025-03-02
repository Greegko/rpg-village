import { DeepPartial, deepDiff } from "./deep-diff";

export function pairwiseDeepDiff<T extends object>() {
  let prev: T | null = null;

  return function compare(current: T): DeepPartial<T> | null {
    if (!prev) {
      prev = current;
      return null;
    }

    const diff = deepDiff(prev, current);
    prev = current;

    return diff;
  };
}
