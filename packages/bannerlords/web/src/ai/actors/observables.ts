export type Subscription = { unsubscribe: () => void };
export class Observable<T> {
  protected listeners: ((val: T) => void)[] = [];

  subscribe(next: (val: T) => void): Subscription {
    this.listeners.push(next);

    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter(x => x !== next);
      },
    };
  }
}

export class Subject<T> extends Observable<T> {
  next(val: T) {
    this.listeners.forEach(fn => fn(val));
  }

  asObservable() {
    return this as Observable<T>;
  }
}
