import { nullVector } from "@rpg-village/utils/node";
import { UnitInit } from "../../interface";
import { healAction, meleeAttackAction, rangeAttackAction, reviveAction } from "./action";

export const createDummyUnit = (dummyUnitArgs: Partial<UnitInit> = {}) =>
  skeletonUnit({ hp: 1000, maxHp: 1000, ...dummyUnitArgs, actions: [], moveSpeed: 0 });

export const skeletonUnit = ({
  id = "skeleton",
  spriteId = "sprites/skeleton/skeleton",
  position = nullVector,
  size = 20,
  team = 1,
  maxHp = 10,
  hp = 10,
  moveSpeed = 5,
  effects = [],
  actions = [meleeAttackAction()],
}: Partial<UnitInit> = {}) =>
  ({
    id,
    spriteId,
    position,
    size,
    team,
    maxHp,
    hp,
    moveSpeed,
    effects,
    actions,
  }) as UnitInit;

export const archerUnit = ({
  id = "skeleton",
  spriteId = "sprites/archer/archer",
  position = nullVector,
  size = 20,
  team = 1,
  maxHp = 10,
  hp = 10,
  moveSpeed = 5,
  effects = [],
  actions = [rangeAttackAction()],
}: Partial<UnitInit> = {}) =>
  ({
    id,
    spriteId,
    position,
    size,
    team,
    maxHp,
    hp,
    moveSpeed,
    effects,
    actions,
  }) as UnitInit;

export const priestUnit = ({
  position = nullVector,
  size = 20,
  team = 1,
  maxHp = 10,
  hp = 10,
  moveSpeed = 5,
  effects = [],
  id = "priest",
  spriteId = "sprites/inquisitor/inquisitor",
  actions = [healAction(), reviveAction()],
}: Partial<UnitInit> = {}) =>
  ({
    id,
    spriteId,
    position,
    size,
    team,
    maxHp,
    hp,
    moveSpeed,
    effects,
    actions,
  }) as UnitInit;
