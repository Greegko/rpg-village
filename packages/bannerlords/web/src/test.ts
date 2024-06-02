export interface Expect<T> {
  toBe(val: T, msg?: string): void;
  toEqual(val: T, msg?: string): void;
}

export function expect<T>(val: T): Expect<T> {
  return {
    toBe: (target: T, msg?: string) => {
      if (val !== target) {
        throw new Error(msg || `Expected ${val} but got ${target}`);
      }
    },
    toEqual: (target: T, msg?: string) => {
      if (JSON.stringify(val) !== JSON.stringify(target)) {
        console.error(msg || "The two objects are not equal", val, target);
        throw new Error(msg || "The two objects are not equal");
      }
    },
  };
}

export const test = (name: string, fn: () => void) => {
  try {
    fn();
    console.log("✓ " + name);
  } catch (e: any) {
    console.log("✘ " + name);
    console.error(e);
  }
};

export const describe = (name: string, fn: () => void) => {
  console.log("Describe " + name);
  fn();
};
