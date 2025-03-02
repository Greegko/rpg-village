export enum DmgType {
  Pure = "pure",
  Physical = "physical",
  Magic = "magic",
  Fire = "fire",
}

export enum EffectType {
  Aura = "aura",
  Revive = "revive",
  Heal = "heal",
  Dmg = "dmg",
  SpawnUnit = "spawn-unit",
  Armor = "armor",
  Dot = "dot",
}

export enum EffectSource {
  Aura = "aura",
}

export type SeekCondition =
  | "enemy-team"
  | "alive"
  | "dead"
  | "same-team"
  | "damaged"
  | "closest-unit"
  | ["in-distance", { distance: number }];

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
