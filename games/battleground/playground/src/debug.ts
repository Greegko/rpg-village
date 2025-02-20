import { without } from "rambda";

type Callback = Function;

interface Listerens {
  start: Callback[];
  stop: Callback[];
  tick: Callback[];
}

export class Debug {
  private isRunning = true;

  private listeners: Listerens = {
    start: [],
    stop: [],
    tick: [],
  };

  addEventListener(type: keyof Listerens, callback: () => void) {
    this.listeners[type].push(callback);
  }

  removeEventListener(type: keyof Listerens, callback: () => void) {
    this.listeners[type] = without(this.listeners[type], [callback]);
  }

  hookGlobalKeys() {
    window.addEventListener("keypress", event => this.nextFrameEvent(event));
    window.addEventListener("keydown", event => this.gamePauseEvent(event));
  }

  private gamePauseEvent(event: KeyboardEvent) {
    if (event.key !== " ") return;

    if (this.isRunning) {
      this.listeners.stop.forEach(fn => fn());
    } else {
      this.listeners.start.forEach(fn => fn());
    }

    this.isRunning = !this.isRunning;
  }

  private nextFrameEvent(event: KeyboardEvent) {
    if (event.key !== "n") return;
    if (this.isRunning) return;

    this.listeners.tick.forEach(fn => fn());
  }
}
