import { injectable } from "inversify";

type ValueUpdaterCallback<T> = (value: T | undefined) => T;
type ValueUpdater<T> = T | ValueUpdaterCallback<T>;

function isValueUpdaterCallback<T>(valueOrUpdater: ValueUpdater<T>): valueOrUpdater is ValueUpdaterCallback<T> {
  return typeof valueOrUpdater === "function";
}

@injectable()
export abstract class KeyValueStore<Key extends string, Value> {
  private state: Map<Key, Value> = new Map();

  getState(): Map<Key, Value> {
    return this.state;
  }

  init(state: Record<Key, Value>) {
    this.state = new Map<Key, Value>(Object.entries(state) as [Key, Value][]);
  }

  get(id: Key): Value | undefined {
    return this.state.get(id);
  }

  set(key: Key, updater: ValueUpdaterCallback<Value>): void;
  set(key: Key, value: Value): void;
  set(key: Key, valueOrUpdater: ValueUpdater<Value>): void {
    if (isValueUpdaterCallback(valueOrUpdater)) {
      this.state.set(key, valueOrUpdater(this.get(key)));
    } else {
      this.state.set(key, valueOrUpdater as Value);
    }
  }

  remove(key: Key): void {
    this.state.delete(key);
  }
}
