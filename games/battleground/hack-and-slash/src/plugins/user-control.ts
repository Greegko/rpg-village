import { without } from "rambda";

export type ClickEventArgs = { x: number; y: number };
export type ClickCallback = (args: ClickEventArgs) => void;
export type KeyboardPress = { key: string };
export type KeyboardPressCallback = (args: KeyboardPress) => void;

export type UserControlEvents = {
  click: ClickCallback[];
  keyPress: KeyboardPressCallback[];
};

export class UserControl {
  private listerners: UserControlEvents = {
    click: [],
    keyPress: [],
  };

  private keyDown = (e: KeyboardEvent) => {
    this.listerners.keyPress.forEach(fn => fn({ key: e.key }));
  };

  private mouseDown = (e: MouseEvent) => {
    this.listerners.click.forEach(fn => fn({ x: e.clientX, y: e.clientY }));
  };

  addEventListener(event: "click", callback: ClickCallback): void;
  addEventListener(event: "keyPress", callback: KeyboardPressCallback): void;
  addEventListener(event: keyof UserControlEvents, callback: any) {
    this.listerners[event].push(callback);
  }

  removeEventListener(event: "click", callback: ClickCallback): void;
  removeEventListener(event: "keyPress", callback: KeyboardPressCallback): void;
  removeEventListener(event: keyof UserControlEvents, callback: any) {
    this.listerners[event] = without(this.listerners[event], [callback]);
  }

  hookEvenets(): void {
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("mousedown", this.mouseDown);
  }
}
