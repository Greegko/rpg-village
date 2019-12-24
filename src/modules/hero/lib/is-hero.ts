import { UnitType, UnitBase } from '../../unit/interfaces';

export function isHero(unit: UnitBase): boolean {
  return unit.type === UnitType.Hero;
}
