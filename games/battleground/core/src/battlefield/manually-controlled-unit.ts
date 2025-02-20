import { Unit } from "./interface";
import { Vector, normVector } from "../utils";

export class ManuallyControlledUnit {
  controlledUnit: Unit | null = null;

  setControlledUnit(unit: Unit) {
    this.controlledUnit = unit;
    this.controlledUnit.moveDirection = undefined;
  }

  setMoveDirection(direction: Vector) {
    if (!this.controlledUnit) return;

    this.controlledUnit.moveDirection = direction ? normVector(direction) : undefined;
  }
}
