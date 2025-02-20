import { Position, Vector, nullVector } from "@rpg-village/battleground-core";

export type ClickEventArgs = Position;
export type ClickCallback = (args: ClickEventArgs) => void;

export type DirectionChangeEventArgs = Vector;
export type DirectionChangeCallback = (args: DirectionChangeEventArgs) => void;

type UserControlEventListeners = {
  click: ClickCallback[];
  direction: DirectionChangeCallback[];
};

export class UserControl {
  private listeners: UserControlEventListeners = {
    click: [],
    direction: [],
  };

  private get direction(): Vector {
    return { x: (this.activeKeys.a ? -1 : 0) + (this.activeKeys.d ? 1 : 0), y: (this.activeKeys.w ? -1 : 0) + (this.activeKeys.s ? 1 : 0) };
  }

  private lastEmittedDirection: Vector = nullVector;

  private emitCurrentDirection() {
    if (this.lastEmittedDirection.x === this.direction.x && this.lastEmittedDirection.y === this.direction.y) return;

    this.lastEmittedDirection = this.direction;

    this.listeners.direction.forEach(fn => fn(this.direction));
  }

  addEventListener(event: "direction", callback: DirectionChangeCallback): void;
  addEventListener(event: "click", callback: ClickCallback): void;
  addEventListener(event: keyof UserControlEventListeners, callback: any) {
    this.listeners[event].push(callback);
  }

  private activeKeys: Record<string, boolean> = {
    a: false,
    w: false,
    s: false,
    d: false,
  };

  private keyDown = (e: KeyboardEvent) => {
    this.activeKeys[e.key] = true;
    this.emitCurrentDirection();
  };

  private keyUp = (e: KeyboardEvent) => {
    this.activeKeys[e.key] = false;
    this.emitCurrentDirection();
  };

  private mouseDown = (e: MouseEvent) => this.listeners.click.forEach(fn => fn({ x: e.clientX, y: e.clientY }));

  hookEvenets(): void {
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
    document.addEventListener("mousedown", this.mouseDown);
  }
}
