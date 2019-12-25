import { UnitType, Unit } from '../interfaces';

export function isHero(unit: Unit): boolean {
  return unit.type === UnitType.Unit;
}
