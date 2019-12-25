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

  get<P extends keyof T>(prop: P): T[P] {
    return this.state[prop];
  }

  set<P extends keyof T>(prop: P, value: T[P]) {
    this.state = assoc(prop as any, value, this.state);
  }
}
