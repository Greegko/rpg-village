import { head, sortBy } from "rambda";

import { getPositionDistance, normVector, rotateVectorBy, subVector } from "../../utils";
import { Context } from "../context";
import { Position, ProjectileNode, Unit } from "../interface";
import { getUnitCentral } from "../utils";
import { isUnitActionHasValidTarget, seekTarget } from "../utils/unit-filter";

export class AiController {
  constructor(private context: Context) {}

  tickAction() {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits.filter(x => !x.userControlled)) {
      this.assignNewAction(this.context.unit.units, unit);
    }

    for (let unit of aliveUnits) {
      this.triggerActionState(unit);
      this.executeAction(unit);
    }
  }

  assignNewAction(units: Unit[], unit: Unit) {
    unit.moveDirection = undefined;

    this.wander;
    this.seekAndMoveToTarget(units, unit);
    this.lockActionWithTarget(units, unit);
  }

  private triggerActionState(unit: Unit) {
    for (let [action, cooldown] of unit.actionsCooldowns.entries()) {
      if (cooldown > 0) {
        unit.actionsCooldowns.set(action, cooldown - 1);
      }
    }

    if (unit.activeAction) {
      if (unit.activeAction.speed > 0) --unit.activeAction.speed;
    }
  }

  private wander(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) {
      unit.moveDirection = this.context.random.vector();
      return;
    }

    const angle = this.context.random.int(-10, 10) / 40;
    unit.moveDirection = rotateVectorBy(unit.moveDirection, angle);
  }

  private seekAndMoveToTarget(units: Unit[], unit: Unit) {
    if (!unit.moveSpeed) return;
    if (unit.activeAction) return;

    const closestUnits = unit.actions
      .map(action => (action.seekTargetCondition ? seekTarget(unit, units, action.seekTargetCondition) : null))
      .filter(x => x) as Unit[];

    const closestTarget = head(sortBy(targetUnit => getPositionDistance(unit.location, targetUnit.location), closestUnits));

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
      sortBy(([, targetUnit]) => (targetUnit ? getPositionDistance(unit.location, targetUnit.location) : Infinity), actions),
    );

    // No valid seek target
    if (targetUnit === undefined) return;

    // No seek condition for the action (target itself)
    if (targetUnit === null) {
      unit.activeAction = { action, speed: action.speed };
      return;
    }

    const distance = getPositionDistance(unit.location, targetUnit.location);

    if (action.distance && distance <= action.distance) {
      unit.activeAction = { action, speed: action.speed, targetUnit };
    }
  }

  private executeAction(unit: Unit) {
    if (!unit.activeAction) return;
    if (unit.activeAction.targetUnit) {
      if (!isUnitActionHasValidTarget(unit, unit.activeAction.targetUnit, unit.activeAction.action)) {
        delete unit.activeAction;
        return;
      }

      const targetDistance = getPositionDistance(unit.location, unit.activeAction.targetUnit.location);

      if (unit.activeAction.action.distance && targetDistance > unit.activeAction.action.distance) {
        delete unit.activeAction;
        return;
      }
    }

    delete unit.moveDirection;

    if (unit.activeAction.speed > 0) return;
    if (!unit.activeAction.action) return;
    if (!unit.actionsCooldowns) return;
    if (unit.actionsCooldowns.get(unit.activeAction.action)! > 0) return;

    if (unit.activeAction.action.projectileId && (unit.activeAction.targetUnit || unit.activeAction.targetPosition)) {
      if (unit.activeAction.targetUnit) {
        this.shootProjectile(unit, getUnitCentral(unit.activeAction.targetUnit));
      } else if (unit.activeAction.targetPosition) {
        this.shootProjectile(unit, unit.activeAction.targetPosition);
      }
    } else {
      if (unit.activeAction.action.hitEffect && unit.activeAction.targetUnit) {
        this.context.effect.applyEffect(unit.activeAction.action.hitEffect, unit.activeAction.targetUnit);
      }

      if (unit.activeAction.action.effect) {
        this.context.effect.applyEffect(unit.activeAction.action.effect, unit);
      }
    }

    unit.actionsCooldowns.set(unit.activeAction.action, unit.activeAction.action.cooldown);

    delete unit.activeAction;
  }

  private shootProjectile(unit: Unit, targetLocation: Position) {
    if (!unit.activeAction) return;

    const action = unit.activeAction.action;
    const sourceLocation = getUnitCentral(unit);
    const time = Math.ceil(getPositionDistance(sourceLocation, targetLocation) / action.projectileSpeed!);

    const projectile: ProjectileNode = {
      id: action.projectileId!,
      area: 1,
      projectileType: action.projectileType!,
      effect: action.hitEffect!,
      source: unit,
      location: sourceLocation,
      sourceLocation,
      speed: action.projectileSpeed!,
      targetLocation,
      time,
      timeState: time,
    };

    this.context.map.addProjectile(projectile);
  }
}
