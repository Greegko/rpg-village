import { injectable } from "inversify";
import { Prop, assoc, prop } from "rambda";

export interface IObjectStore<T extends object> {
  getState(): T;
  init(state: T): void;

  get(prop: keyof T): T[keyof T];
  set(prop: keyof T, value: T[keyof T]): void;
}

@injectable()
export class ObjectStore<T extends object> implements IObjectStore<T> {
  private state: T = {} as T;

  getState(): T {
    return this.state;
  }

  init(state: T) {
    this.state = state;
  }

  get<P extends keyof T>(prop: P): T[P] {
    return this.state[prop];
  }

  set<P extends keyof T>(prop: P, value: T[P]) {
    this.state = assoc(prop as string, value, this.state) as T;
  }

  update<P extends keyof T>(property: P, updater: (value: Prop<T, P>) => Prop<T, P>) {
    this.state = assoc(property as string, updater(prop(property, this.state)), this.state) as T;
  }
}
