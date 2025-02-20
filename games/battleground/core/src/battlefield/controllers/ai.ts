import { head, sortBy } from "rambda";

import { Random, getVectorDistance, normVector, rotateBy, subVector } from "../../utils";
import { Unit } from "../interface";
import { seekTarget } from "../utils/unit-filter";

export class AiController {
  constructor(private random: Random) {}

  execute(units: Unit[], unit: Unit) {
    unit.moveDirection = undefined;

    // this.wander(unit);
    this.seekAndMoveToTarget(units, unit);
    this.lockActionWithTarget(units, unit);
  }

  private wander(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) {
      unit.moveDirection = this.random.vector();
      return;
    }

    const angle = this.random.int(-10, 10) / 40;
    unit.moveDirection = rotateBy(unit.moveDirection, angle);
  }

  private seekAndMoveToTarget(units: Unit[], unit: Unit) {
    if (!unit.moveSpeed) return;
    if (unit.activeAction) return;

    const closestUnits = unit.actions
      .map(action => (action.seekTargetCondition ? seekTarget(unit, units, action.seekTargetCondition) : null))
      .filter(x => x) as Unit[];

    const closestTarget = head(sortBy(targetUnit => getVectorDistance(unit.location, targetUnit.location), closestUnits));

    if (!closestTarget) return;

    unit.moveDirection = normVector(subVector(closestTarget.location, unit.location));
  }

  private lockActionWithTarget(units: Unit[], unit: Unit) {
    if (unit.activeAction) return;
    if (unit.actions.length === 0) return;

    const actions = unit.actions.map(
      action => [action, action.seekTargetCondition ? seekTarget(unit, units, action.seekTargetCondition) : null] as const,
    );

    const [action, targetUnit] = head(
      sortBy(([, targetUnit]) => (targetUnit ? getVectorDistance(unit.location, targetUnit.location) : Infinity), actions),
    );

    // No valid seek target
    if (targetUnit === undefined) return;

    // No seek condition for the action (target itself)
    if (targetUnit === null) {
      unit.activeAction = { action, speed: action.speed };
      return;
    }

    const distance = getVectorDistance(unit.location, targetUnit.location);

    if (action.distance && distance <= action.distance) {
      unit.activeAction = { action, speed: action.speed, targetUnit };
    }
  }
}
