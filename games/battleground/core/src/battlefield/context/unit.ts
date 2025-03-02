import { clone, mergeRight } from "rambda";

import {
  addVector,
  createVectorFromAngle,
  divVector,
  invXVector,
  invYVector,
  isNullVector,
  multVector,
  normVector,
  subVector,
} from "@rpg-village/utils/node";

import { RandomContextToken } from "@/features/random";
import { Unit, UnitID, UnitInit, UnitState, inTouchWithOthers } from "@/features/unit";

import { inject, injectable } from "../injection-container";
import { BattlefieldConfigToken } from "../interface";

@injectable()
export class UnitContext {
  private randomContext = inject(RandomContextToken);
  private battlefieldConfig = inject(BattlefieldConfigToken);

  units: Unit[] = [];

  tickUnitsMove(): void {
    const aliveUnits = this.units.filter(x => x.hp > 0);

    for (let unit of aliveUnits.filter(x => x.moveDirection)) {
      this.separation(unit, aliveUnits);
      this.screenBoundaries(unit);
      this.moveUnit(unit);
    }
  }

  getUnitById(unitId: UnitID): Unit {
    return this.units.find(x => x.id === unitId)!;
  }

  addUnit(unit: UnitInit) {
    const unitClone = clone(unit);

    const initUnitState: UnitState = {
      id: this.randomContext.uniqueId(),
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

    unit.position = addVector(unit.position, multVector(unit.moveDirection, unit.moveSpeed));
  }

  screenBoundaries(unit: Unit) {
    if (!unit.moveSpeed) return;
    if (!unit.moveDirection) return;

    const unitWidth = unit.size;

    const futurePoint = addVector(multVector(unit.moveDirection, unit.moveSpeed), unit.position);

    if (futurePoint.x > this.battlefieldConfig.mapSize[0] - unitWidth || futurePoint.x < 0) {
      unit.moveDirection = invXVector(unit.moveDirection);
    }

    if (futurePoint.y > this.battlefieldConfig.mapSize[1] - unitWidth || futurePoint.y < 0) {
      unit.moveDirection = invYVector(unit.moveDirection);
    }
  }

  separation(unit: Unit, units: Unit[]) {
    if (!unit.moveSpeed) return;

    const otherUnitsInDistance = inTouchWithOthers(unit, units);
    let sumSubVector = otherUnitsInDistance.reduce((acc, curr) => addVector(acc, normVector(subVector(unit.position, curr.position))), {
      x: 0,
      y: 0,
    });

    if (otherUnitsInDistance.length > 0) {
      const direction = divVector(sumSubVector, otherUnitsInDistance.length);
      unit.moveDirection = isNullVector(direction) ? createVectorFromAngle(this.randomContext.next() * Math.PI * 2) : direction;
    }
  }
}
