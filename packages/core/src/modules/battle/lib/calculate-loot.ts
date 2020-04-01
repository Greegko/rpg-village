import { Loot } from "../../../models";
import { Unit } from "../../unit";
import { sum } from 'ramda';

export function calculateLoot(units: Unit[]): Loot {
  const gold = sum(units.map(unit => unit.level * 25));
  const xp = sum(units.map(unit => unit.level * 25));

  return {
    resource: { gold },
    xp,
  }
}
