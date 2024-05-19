export type Subscription = { unsubscribe: () => void };
export class Observable<T> {
  protected listeners: ((val: T) => void)[] = [];
  protected _filter?: (val: T) => boolean;

  filter(cond: (val: T) => boolean): Observable<T> {
    this._filter = cond;

    return this;
  }

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
    this.listeners.forEach(fn => {
      if (this._filter) {
        if (this._filter(val)) {
          fn(val);
        }
      } else {
        fn(val);
      }
    });
  }

  asObservable() {
    return this as Observable<T>;
  }
}
