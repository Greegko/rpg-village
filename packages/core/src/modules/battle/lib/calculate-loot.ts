import { Loot } from "@models";
import { Unit } from "@modules/unit";

export function calculateLoot(units: Unit[]): Loot {
  return {
    resource: { gold: units.length * 25, soul: units.length },
    items: [],
  };
}
