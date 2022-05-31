import { Loot } from "@models/loot";
import { sum } from "ramda";

import { Unit } from "@modules/unit";

export function calculateLoot(units: Unit[]): Loot {
  const xp = sum(units.map(unit => unit.level * 25));

  return {
    resource: {},
    xp,
  };
}
