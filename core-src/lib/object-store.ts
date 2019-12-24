import { assoc } from 'ramda';
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

  get(prop: keyof T) {
    return this.state[prop];
  }

  set(prop: keyof T, value: T[keyof T]) {
    this.state = assoc(prop as any, value, this.state);
  }
}
