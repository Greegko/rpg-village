import { Vector, addVector, getVectorDistance } from "../../utils";
import { Unit } from "../interface";

export function getUnitCentral(unit: Unit): Vector {
  return addVector(unit.location, { x: unit.size / 2, y: unit.size / 2 });
}

export function inTouchWithOthers(unit: Unit, targets: Unit[]): Unit[] {
  return targets.filter(
    target => target !== unit && getVectorDistance(getUnitCentral(unit), getUnitCentral(target)) < target.size / 2 + unit.size / 2,
  );
}
