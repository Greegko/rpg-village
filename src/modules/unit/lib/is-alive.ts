import { UnitBase } from '../interfaces';

export function isAlive(unit: UnitBase): boolean {
  return unit.hp > 0;
}
