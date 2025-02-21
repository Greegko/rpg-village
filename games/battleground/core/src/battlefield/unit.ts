import { clone, mergeRight, partition, without } from "rambda";

import { addVector, divVector, invXVector, invYVector, isZeroVector, multVector, normVector, subVector } from "../utils";
import { Context } from "./context";
import { DotEffect, Effect, EffectType, Unit, UnitID, UnitInit, UnitState } from "./interface";
import { inTouchWithOthers } from "./utils";

export class UnitContext {
  constructor(private context: Context) {}

  units: Unit[] = [];

  tickUnitsMove(): void {
    const aliveUnits = this.context.unit.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits.filter(x => x.moveDirection)) {
      this.context.unit.separation(unit, aliveUnits);
      this.context.unit.screenBoundaries(unit);
      this.context.unit.moveUnit(unit);
    }
  }

  getUnitById(unitId: UnitID): Unit {
    return this.units.find(x => x.id === unitId)!;
  }

  triggerDotEffects(unit: Unit) {
    const effects = unit.effects.filter(x => x.type === EffectType.Dot) as DotEffect[];

    const [oldEffects, newEffects] = partition(x => !!x.state, effects);

    oldEffects.forEach(effect => effect.state.intervalState--);

    const triggerEffects = oldEffects.filter(x => x.state.intervalState === 0);

    if (triggerEffects.length > 0) {
      this.context.effect.applyEffect(
        triggerEffects.map(x => x.effect),
        unit,
      );
    }

    const clearEffects: Effect[] = [];

    for (let effect of triggerEffects) {
      if (effect.state.remainingPeriod === 1) {
        clearEffects.push(effect);
      } else {
        effect.state.remainingPeriod--;
        effect.state.intervalState = effect.interval;
      }
    }

    for (let effect of newEffects) {
      effect.state = { remainingPeriod: effect.period, intervalState: effect.interval };
    }

    if (clearEffects.length > 0) {
      unit.effects = without(clearEffects, unit.effects);
    }
  }

  addUnit(unit: UnitInit) {
    const unitClone = clone(unit);

    const initUnitState: UnitState = {
      userControlled: false,
      actionsCooldowns: new Map(unitClone.actions.map(action => [action, 0])),
      effects: unitClone.effects || [],
      hp: unitClone.hp ?? unitClone.maxHp,
    };

    this.units.push(mergeRight(unitClone, initUnitState));
  }

  moveUnit(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) return;

    unit.location = addVector(unit.location, multVector(unit.moveDirection, unit.moveSpeed));
  }

  screenBoundaries(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) return;

    const unitWidth = unit.size;

    const futurePoint = addVector(multVector(unit.moveDirection, unit.moveSpeed), unit.location);

    if (futurePoint.x > this.context.config.mapSize[0] - unitWidth || futurePoint.x < 0) {
      unit.moveDirection = invXVector(unit.moveDirection);
    }

    if (futurePoint.y > this.context.config.mapSize[1] - unitWidth || futurePoint.y < 0) {
      unit.moveDirection = invYVector(unit.moveDirection);
    }
  }

  separation(unit: Unit, units: Unit[]) {
    if (!unit.moveSpeed) return;

    const otherUnitsInDistance = inTouchWithOthers(unit, units);
    let sumSubVector = otherUnitsInDistance.reduce((acc, curr) => addVector(acc, normVector(subVector(unit.location, curr.location))), {
      x: 0,
      y: 0,
    });

    if (otherUnitsInDistance.length > 0) {
      const direction = divVector(sumSubVector, otherUnitsInDistance.length);
      unit.moveDirection = isZeroVector(direction) ? this.context.random.vector() : direction;
    }
  }
}
