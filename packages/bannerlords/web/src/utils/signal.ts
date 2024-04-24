import { forEach, keys } from "remeda";
import { createComputed } from "solid-js";

export const onKeyAdded = <K extends string, V>(path: () => Record<K, V>, fn: (key: K, value: V) => void) => {
  let prevState = {} as Record<K, V>;

  createComputed(() => {
    const currentState = path();

    forEach(keys(currentState) as K[], (currentStateKey: K) => {
      if (prevState[currentStateKey] === undefined) {
        fn(currentStateKey, currentState[currentStateKey]);
      }
    });

    prevState = currentState;
  });
};

export const onKeyRemoved = <K extends string, V>(path: () => Record<K, V>, fn: (key: K, value: V) => void) => {
  let prevState = {} as Record<K, V>;

  createComputed(() => {
    const currentState = path();

    forEach(keys(prevState) as K[], (prevStateKey: K) => {
      if (currentState[prevStateKey] === undefined) {
        fn(prevStateKey, currentState[prevStateKey]);
      }
    });

    prevState = currentState;
  });
};
