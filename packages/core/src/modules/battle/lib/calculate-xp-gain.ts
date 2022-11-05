import { sum } from "ramda";

import { Unit } from "@modules/unit";

export function calculateXpGain(units: Unit[]): number {
  return sum(units.map(unit => unit.level * 25));
}
