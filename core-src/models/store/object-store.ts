export interface IObjectStore<T extends object> {
  getState(): T;
  init(state: T);
  
  get(prop: keyof T): T[keyof T];
  set(prop: keyof T, value: T[keyof T]);
}
