import { ExecutionContext } from "ava";

type WithRandomIdAssertion = <T, P extends keyof T>(state: T, expectedState: Partial<T[P]>) => void;

export interface ExecutionTestContext<T> extends ExecutionContext<T> {
  withRandomId: WithRandomIdAssertion;
}

export function withRandomIDAssertionFactory(t: ExecutionContext<unknown>): WithRandomIdAssertion {
  return function withRandomIDAssertion<T, P extends keyof T>(state: T, expectedState: Partial<T[P]>): void {
    const keys = Object.keys(state);

    t.is(keys.length, 1);

    const randomID = keys[0] as P;
    t.like(state[randomID], expectedState);
  };
}
