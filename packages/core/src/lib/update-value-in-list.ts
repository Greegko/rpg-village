import { without } from "rambda";

export function updateValueInList<T>(list: T[], targetValue: T, updater: (val: T) => T | null) {
  const newTargetValue = updater(targetValue);

  if (newTargetValue === null) {
    return without([targetValue], list);
  } else {
    return list.map(x => (x === targetValue ? newTargetValue : x));
  }
}
