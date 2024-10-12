import { flat, times } from "remeda";

import { Die, Effect } from "./model";

export type RollResult = [side: number, effect: Effect];
export function rollDie(dieSides: Die): RollResult {
  const totalSides = dieSides.reduce((acc, [sides]) => acc + sides, 0);
  const allEffects = dieSides.reduce((acc, [sides, effect]) => [...acc, ...flat(times(sides, () => effect.effects))], [] as Effect[]);

  const side = Math.floor(Math.random() * totalSides);

  return [side, allEffects[side]];
}
