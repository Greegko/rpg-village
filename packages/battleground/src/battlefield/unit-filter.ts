import { sortBy } from "rambda";

import { Action, SeekCondition, Unit } from "./interface";
import { getUnitCentral } from "./utils";
import { Vector, getVectorDistance } from "../utils";

interface SingleUnitSeekConditionContext {
  unit?: Unit;
  team?: number;
  targetLocation?: Vector;
}

interface FilterUnitSeekConditionContext {
  units?: Unit[];
  team?: number;
  targetLocation?: Vector;
}

type SeekConditionContext = SingleUnitSeekConditionContext | FilterUnitSeekConditionContext;

type ConditionFn<Item extends SeekCondition> = Item extends [string, infer R]
  ? (context: SeekConditionContext, config: R) => boolean
  : (context: SeekConditionContext) => boolean;

type ConditionMap<Item extends SeekCondition> = Item extends string
  ? { [key in Item]: (context: SingleUnitSeekConditionContext) => boolean }
  : { [key in Item[0]]: (context: SingleUnitSeekConditionContext, config: Item[1]) => boolean };

type FilterConditionMap<Item extends SeekCondition> = Item extends string
  ? { [key in Item]: (context: FilterUnitSeekConditionContext) => Unit[] }
  : { [key in Item[0]]: (context: FilterUnitSeekConditionContext, config: Item[1]) => Unit[] };

export class UnitFilter {
  private static unitConditions: ConditionMap<SeekCondition> = {
    "enemy-team": ({ unit, team }) => (unit ? unit.team !== team : false),
    "same-team": ({ unit, team }) => (unit ? unit.team === team : false),
    "in-distance": ({ unit, targetLocation }, { distance }) =>
      unit ? getVectorDistance(getUnitCentral(unit), targetLocation!) <= unit.size / 2 + distance : false,
    alive: ({ unit }) => (unit ? unit.hp > 0 : false),
    dead: ({ unit }) => (unit ? unit.hp === 0 : false),
    damaged: ({ unit }) => (unit ? unit.hp < unit.maxHp : false),
  };

  private static allUnitsConditions: FilterConditionMap<SeekCondition> = {
    "closest-unit": ({ units, targetLocation }) => {
      const sortedUnits = sortBy(unit => getVectorDistance(getUnitCentral(unit), targetLocation!), units!);

      return [sortedUnits[0]];
    },
  };

  private static getConditionFn<T extends SeekCondition>(condition: T): ConditionFn<T> {
    if (typeof condition === "string") {
      return (this.unitConditions as any)[condition];
    }

    return (this.unitConditions as any)[condition[0]];
  }

  static filterBySeekConditions(units: Unit[], conditions: SeekCondition[], context: SingleUnitSeekConditionContext) {
    return conditions.reduce((remainingUnits, condition) => {
      if (remainingUnits.length === 0) return [];

      const unitConditionFn =
        typeof condition === "string"
          ? (this.unitConditions as any)[condition]
          : (this.unitConditions as any)[condition[0]];

      if (unitConditionFn) {
        return remainingUnits.filter(unit => unitConditionFn({ unit, ...context }, condition[1]));
      }

      const filterUnitConditionFn =
        typeof condition === "string"
          ? (this.allUnitsConditions as any)[condition]
          : (this.allUnitsConditions as any)[condition[0]];

      if (filterUnitConditionFn) {
        return filterUnitConditionFn({ units: remainingUnits, ...context }, condition[1]);
      }
    }, units);
  }

  static isUnitActionHasValidTarget(unit: Unit, targetUnit: Unit, action: Action): boolean {
    const context: SingleUnitSeekConditionContext = {
      unit: targetUnit,
      team: unit.team,
      targetLocation: unit.location,
    };

    if (!action.seekTargetCondition) return false;

    return action.seekTargetCondition.every(condition => this.getConditionFn(condition)(context, condition[1] as any));
  }
}
