import { Unit } from "@features/unit";
import { Loot } from "@models";

export function calculateLoot(units: Unit[]): Loot {
  return {
    resource: { gold: units.length * 25, soul: units.length },
    items: [],
  };
}
