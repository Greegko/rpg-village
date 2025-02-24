import "vitest";

interface CustomMatchers<R = unknown> {
  objectHaveElements: (length: number) => R;
  withRandomId: (partialState: object) => R;
}

declare module "vitest" {
  interface Assertion<T extends string> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}
