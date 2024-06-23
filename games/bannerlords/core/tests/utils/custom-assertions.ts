import { ExecutionContext } from "ava";

type WithRandomIdAssertion = <T extends object, P extends keyof T>(state: T, expectedState: Partial<T[P]>) => void;
type LengthAssertion = <T extends object | any[]>(value: T, length: number) => void;
type UndefinedAssertion = <T>(value: T | undefined) => void;

export interface ExecutionTestContext<T> extends ExecutionContext<T> {
  withRandomId: WithRandomIdAssertion;
  length: LengthAssertion;
  undefined: UndefinedAssertion;
}

export function withRandomIDAssertionFactory(t: ExecutionContext<unknown>): WithRandomIdAssertion {
  return function withRandomIDAssertion<T extends object, P extends keyof T>(
    state: T,
    expectedState: Partial<T[P]>,
  ): void {
    const keys = Object.keys(state);

    t.is(keys.length, 1);

    const randomID = keys[0] as P;
    t.like(state[randomID], expectedState);
  };
}

export function lengthAssertionFactory(t: ExecutionContext<unknown>): LengthAssertion {
  return function lengthAssertion<T extends object | any[]>(state: T, length: number): void {
    const valueLength = Array.isArray(state) ? state.length : Object.keys(state).length;

    t.is(valueLength, length);
  };
}

export function undefinedAssertionFactory(t: ExecutionContext<unknown>): UndefinedAssertion {
  return function undefinedAssertion<T>(state: T | undefined): void {
    t.is(state, undefined);
  };
}
