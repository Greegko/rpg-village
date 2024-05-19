import { Observable, Subject } from "./observables";

export type EventCallback = () => void;
export class EventSystem {
  private listeners: Record<string, Subject<void>> = {};

  on(event: string): Observable<void> {
    this.listeners[event] = new Subject<void>();

    return this.listeners[event];
  }

  fire(event: string) {
    if (this.listeners[event]) {
      this.listeners[event].next();
    }
  }
}
