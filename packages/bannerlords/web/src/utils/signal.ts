import { forEach, keys } from "remeda";
import { distinctUntilChanged, from, skip } from "rxjs";
import { Accessor, createComputed, getOwner, observable, runWithOwner, untrack } from "solid-js";

export const onKeyAdded = <K extends string, V>(path: Accessor<Record<K, V>>, fn: (key: K, value: V) => void) => {
  let prevState = {} as Record<K, V>;

  const owner = getOwner();

  createComputed(() => {
    const currentState = path();
    runWithOwner(owner, () => {
      forEach(keys(currentState) as K[], (currentStateKey: K) => {
        if (prevState[currentStateKey] === undefined) {
          fn(currentStateKey, currentState[currentStateKey]);
        }
      });
    });
    prevState = currentState;
  });
};

export const onValueChanges = <K extends string, V>(state: () => Record<K, V>, fn: (key: K, value: V) => void) => {
  let cache = state();

  const owner = getOwner();
  createComputed(() => {
    const allKeys = keys(state()) as K[];
    runWithOwner(owner, () => {
      forEach(allKeys, key => {
        if (state()[key] !== cache[key]) {
          fn(key, state()[key]);
        }
      });
    });
  });
};

export const onEvent = (triggerCondition: Accessor<boolean>, fn: () => void) => {
  const owner = getOwner();
  createComputed(() => {
    if (triggerCondition()) {
      runWithOwner(owner, () => untrack(() => fn()));
    }
  });
};

export const asObservable = <T>(input: Accessor<T>, skipInitEmit: boolean = true) => {
  return from(observable(input)).pipe(skip(skipInitEmit ? 1 : 0), distinctUntilChanged());
};
