import * as expect from "expect";

export function withRandomID<T extends object, P extends keyof T>(state: T, subState: Partial<T[P]>): void {
  const keys = Object.keys(state);

  expect(keys.length).toBe(1);

  const randomID = keys[0] as P;
  expect(state[randomID]).toMatchObject(subState);
}
