import { head, prop, sortBy } from "rambda";

import { Position, getPositionDistance } from "@rpg-village/utils/node";

import { Action, SeekCondition, Unit } from "../interface";
import { getUnitCentral } from "./unit";

interface SingleUnitSeekConditionContext {
  unit?: Unit;
  team?: number;
  targetPosition?: Position;
}

interface FilterUnitSeekConditionContext {
  units?: Unit[];
  team?: number;
  targetPosition?: Position;
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

const unitConditions: ConditionMap<SeekCondition> = {
  "enemy-team": ({ unit, team }) => (unit ? unit.team !== team : false),
  "same-team": ({ unit, team }) => (unit ? unit.team === team : false),
  "in-distance": ({ unit, targetPosition }, { distance }) =>
    unit ? getPositionDistance(getUnitCentral(unit), targetPosition!) <= unit.size / 2 + distance : false,
  alive: ({ unit }) => (unit ? unit.hp > 0 : false),
  dead: ({ unit }) => (unit ? unit.hp === 0 : false),
  damaged: ({ unit }) => (unit ? unit.hp < unit.maxHp : false),
};

const allUnitsConditions: FilterConditionMap<SeekCondition> = {
  "closest-unit": ({ units, targetPosition }) => {
    const sortedUnits = sortBy(unit => getPositionDistance(getUnitCentral(unit), targetPosition!), units!);

    return [sortedUnits[0]];
  },
};

function getConditionFn<T extends SeekCondition>(condition: T): ConditionFn<T> {
  if (typeof condition === "string") {
    return (unitConditions as any)[condition];
  }

  return (unitConditions as any)[condition[0]];
}

export function filterBySeekConditions(units: Unit[], conditions: SeekCondition[], context: SingleUnitSeekConditionContext) {
  return conditions.reduce((remainingUnits, condition) => {
    if (remainingUnits.length === 0) return [];

    const unitConditionFn = typeof condition === "string" ? (unitConditions as any)[condition] : (unitConditions as any)[condition[0]];

    if (unitConditionFn) {
      return remainingUnits.filter(unit => unitConditionFn({ unit, ...context }, condition[1]));
    }

    const filterUnitConditionFn =
      typeof condition === "string" ? (allUnitsConditions as any)[condition] : (allUnitsConditions as any)[condition[0]];

    if (filterUnitConditionFn) {
      return filterUnitConditionFn({ units: remainingUnits, ...context }, condition[1]);
    }
  }, units);
}

export function isUnitActionHasValidTarget(unit: Unit, targetUnit: Unit, action: Action): boolean {
  const context: SingleUnitSeekConditionContext = {
    unit: targetUnit,
    team: unit.team,
    targetPosition: unit.position,
  };

  if (!action.seekTargetCondition) return false;

  return action.seekTargetCondition.every(condition => getConditionFn(condition)(context, condition[1] as any));
}

export function seekTarget(unit: Unit, units: Unit[], seekConditions: SeekCondition[]): Unit {
  let filteredUnits = filterBySeekConditions(units, seekConditions, { team: unit.team });
  let targetDistances = filteredUnits.map(target => [getPositionDistance(unit.position, target.position), target] as const);
  let sorted = sortBy(prop(0), targetDistances);

  return head(sorted)?.[1];
}

export function getUnitsInRange(units: Unit[], targetPosition: Position, distance: number): Unit[] {
  return filterBySeekConditions(units, ["alive", ["in-distance", { distance }]], { targetPosition });
}
