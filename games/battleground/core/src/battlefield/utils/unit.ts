import { Position, addVector, getPositionDistance } from "@rpg-village/utils/node";

import { Unit } from "../interface";

export function getUnitCentral(unit: Unit): Position {
  return addVector(unit.position, { x: unit.size / 2, y: unit.size / 2 });
}

export function inTouchWithOthers(unit: Unit, targets: Unit[]): Unit[] {
  return targets.filter(
    target => target !== unit && getPositionDistance(getUnitCentral(unit), getUnitCentral(target)) < target.size / 2 + unit.size / 2,
  );
}
