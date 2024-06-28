import { Vector } from "../../utils";

export type SeekCondition =
  | "enemy-team"
  | "alive"
  | "dead"
  | "same-team"
  | "damaged"
  | "closest-unit"
  | ["in-distance", { distance: number }];

export enum DmgType {
  Pure = "pure",
  Physical = "physical",
  Magic = "magic",
  Fire = "fire",
}

export enum EffectType {
  Aura = "aura",
  Review = "revive",
  Heal = "heal",
  Dmg = "dmg",
  SpawnUnit = "spawn-unit",
  Armor = "armor",
  Dot = "dot",
}

export enum EffectSource {
  Aura = "aura",
}

export type EffectBase = { source?: EffectSource; toClear?: boolean; uniqueId?: string };

export type AuraEffect = { type: EffectType.Aura; range: number; effect: Effect; seekTargetCondition: SeekCondition[] };
export type HealEffect = { type: EffectType.Heal; power: number };
export type DmgEffect = { type: EffectType.Dmg; dmgType: DmgType; power: number | [min: number, max: number] };
export type ArmorEffect = { type: EffectType.Armor; dmgType: DmgType; power: number };
export type DotEffect = {
  type: EffectType.Dot;
  effect: Effect;
  interval: number;
  period: number;
  state: { intervalState: number; remainingPeriod: number };
};

export type Effect = EffectBase & (AuraEffect | HealEffect | DmgEffect | ArmorEffect | DotEffect);

export type Animation = "attack";

export interface ActionActive {
  action: Action;
  speed: number;
  targetUnit?: Unit;
}

export interface Action {
  seekTargetCondition?: SeekCondition[];
  animation?: Animation;
  cooldown: number;
  speed: number;
  effect?: Effect[];
  distance?: number;
  hitEffect?: Effect[];
  projectileId?: string;
  projectileSpeed?: number;
}

export interface UnitConfig {
  id: string;
  spriteId: string;
  size: number;
  maxHp: number;
  actions: Action[];
  effects?: Effect[];
  moveSpeed?: number;
}

export interface UnitSetup extends Partial<UnitConfig> {
  location: Vector;
  team: number;
  hp?: number;
}

export interface UnitState {
  hp: number;
  effects: Effect[];
  actionsCooldowns: Map<Action, number>;
  activeAction?: ActionActive;
  moveDirection?: Vector;
}

export type UnitInit = UnitConfig & UnitSetup;
export type Unit = UnitInit & UnitState;
