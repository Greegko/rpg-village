import { Unit, UnitType } from "../interfaces";

export function isHero(unit: Unit): boolean {
  return unit.type === UnitType.Hero;
}
