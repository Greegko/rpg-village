import { assoc, prop } from 'ramda';
import { IObjectStore } from "../models";
import { injectable } from 'inversify';

@injectable()
export class ObjectStore<T extends object> implements IObjectStore<T> {
  private state: T;

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
    this.state = assoc(prop as string, value, this.state);
  }

  update<P extends keyof T>(property: P, updater: (value: T[P]) => T[P]) {
    this.state = assoc(property as string, updater(prop(property as string, this.state)), this.state);
  }
}
