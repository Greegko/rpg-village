export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> | null : T[K] | null;
};

export function deepDiff<T extends object>(prev: T, current: T): DeepPartial<T> {
  function findChanges<TObj extends object>(prevObj: TObj, currObj: TObj): DeepPartial<TObj> {
    const allKeys = new Set([...Object.keys(prevObj), ...Object.keys(currObj)]);
    const diff: DeepPartial<TObj> = {};

    for (const key of allKeys) {
      const prevValue = prevObj[key];
      const currValue = currObj[key];

      if (typeof currValue === "object" && currValue !== null && !Array.isArray(currValue)) {
        const nestedChanges = findChanges((prevValue as object) || {}, (currValue as object) || {});
        if (Object.keys(nestedChanges).length > 0) {
          diff[key] = nestedChanges;
        }
      } else if (Array.isArray(currValue)) {
        if (!Array.isArray(prevValue) || prevValue.length !== currValue.length || !prevValue.every((val, i) => val === currValue[i])) {
          diff[key] = currValue;
        }
      } else if (currValue !== prevValue) {
        diff[key] = currValue;
      } else if (key in prevObj && !(key in currObj)) {
        diff[key] = null;
      }
    }

    for (const key in prevObj) {
      if (!(key in currObj)) {
        diff[key] = null;
      }
    }

    return diff;
  }

  return findChanges(prev, current);
}
