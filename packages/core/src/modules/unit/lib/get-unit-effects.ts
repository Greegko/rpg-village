import { Effect } from "@models/effect";
import { flatten, pathOr } from "ramda";

import { Unit } from "../interfaces";

export function getUnitEffects(unit: Unit): Effect[] {
  return flatten<any>([
    pathOr([], ["equipment", "rightHand", "effects"], unit),
    pathOr([], ["equipment", "leftHand", "effects"], unit),
    pathOr([], ["equipment", "torso", "effects"], unit),
  ]);
}
