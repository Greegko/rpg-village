import { sum } from "ramda";
import { Loot } from "@models/loot";
import { Unit } from "@modules/unit";

export function calculateLoot(units: Unit[]): Loot {
  const gold = sum(units.map(unit => unit.level * 25));
  const xp = sum(units.map(unit => unit.level * 25));

  return {
    resource: { gold },
    xp,
  };
}
