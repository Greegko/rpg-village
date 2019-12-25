import { Unit } from '../interfaces';

export function isAlive(unit: Unit): boolean {
  return unit.hp > 0;
}
