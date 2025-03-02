// Source: https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
import { RandomNextFn, cyrb128, sfc32 } from "./utils";

type SeededStateEncoded = string;
type SeededState = [number, number, number, number];

export class SeededRandom {
  private _next: RandomNextFn;

  private constructor(state: SeededState) {
    this._next = sfc32(...state);
  }

  static createFromText(seedText: string) {
    return new SeededRandom(cyrb128(seedText));
  }

  static createFromState(state: SeededStateEncoded) {
    const innerState = state.split(",").map(x => parseInt(x, 36)) as SeededState;

    if (innerState.length !== 4) throw Error("Not valid seed state");
    return new SeededRandom(innerState);
  }

  getState(): SeededStateEncoded {
    return this._next
      .getState()
      .map(x => x.toString(36))
      .join(",");
  }

  next(): number {
    return this._next();
  }

  int(min: number, max: number): number {
    return Math.floor(this._next() * (max - min + 1) + min);
  }

  sample<T>(array: T[]): T {
    var length = array.length;
    return array[this.int(0, length - 1)];
  }

  uniqueId(): string {
    return this.int(10000000000, 99999999999).toString(36);
  }
}
