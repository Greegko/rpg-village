import { sum } from "rambda";

import { Unit } from "@features/unit";

export function calculateXpGain(units: Unit[]): number {
  return sum(units.map(unit => unit.level * 25));
}
