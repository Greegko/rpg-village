import { Position, Vector } from "@rpg-village/utils/node";

import { Effect, SeekCondition } from "@/features/effect";
import { SpriteID } from "@/features/node";
import { ProjectileType } from "@/features/projectile";

export type Animation = "attack";

export interface ActionActive {
  action: Action;
  speed: number;
  targetUnit?: Unit;
  targetPosition?: Position;
}

export type UnitID = string;

export interface Action {
  seekTargetCondition?: SeekCondition[];
  animation?: Animation;
  cooldown: number;
  speed: number;
  effect?: Effect[];
  distance?: number;
  hitEffect?: Effect[];
  spriteId?: SpriteID;
  projectileSize?: number;
  projectileSpeed?: number;
  projectileType?: ProjectileType;
}

export type UnitConfigID = string;

export interface UnitConfig {
  configId: UnitConfigID;
  spriteId: SpriteID;
  size: number;
  maxHp: number;
  actions: Action[];
  effects?: Effect[];
  moveSpeed?: number;
}

export interface UnitSetup extends Partial<UnitConfig> {
  position: Position;
  team: number;
  hp?: number;
}

export interface UnitState {
  id: UnitID;
  hp: number;
  userControlled: boolean;
  effects: Effect[];
  actionsCooldowns: Map<Action, number>;
  activeAction?: ActionActive;
  moveDirection?: Vector;
}

export type UnitInit = UnitConfig & UnitSetup;
export type Unit = UnitInit & UnitState;
