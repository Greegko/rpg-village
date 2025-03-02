import { DeepPartial, deepDiff } from "./deep-diff";

export function pairwiseDeepDiff<T extends object>() {
  let prev: T | null = null;

  return function compare(current: T): DeepPartial<T> {
    if (!prev) {
      prev = current;
      return current;
    }

    const diff = deepDiff(prev, current);
    prev = current;

    return diff;
  };
}
