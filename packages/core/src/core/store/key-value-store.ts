import { injectable } from "inversify";
import { assoc, dissoc } from "rambda";

type ValueUpdaterCallback<T> = (value: T | undefined) => T;
type ValueUpdater<T> = T | ValueUpdaterCallback<T>;

function isValueUpdaterCallback<T>(valueOrUpdater: ValueUpdater<T>): valueOrUpdater is ValueUpdaterCallback<T> {
  return typeof valueOrUpdater === "function";
}

@injectable()
export abstract class KeyValueStore<Key extends string, Value> {
  private state = {} as Record<Key, Value>;

  getState(): Record<Key, Value> {
    return this.state;
  }

  init(state: Record<Key, Value>) {
    this.state = state;
  }

  get(id: Key): Value | undefined {
    return this.state[id];
  }

  set(key: Key, updater: ValueUpdaterCallback<Value>): void;
  set(key: Key, value: Value): void;
  set(key: Key, valueOrUpdater: ValueUpdater<Value>): void {
    if (isValueUpdaterCallback(valueOrUpdater)) {
      this.state = assoc(key, valueOrUpdater(this.get(key)), this.state);
    } else {
      this.state = assoc(key, valueOrUpdater, this.state);
    }
  }

  remove(key: Key): void {
    this.state = dissoc(key, this.state) as Record<Key, Value>;
  }
}
