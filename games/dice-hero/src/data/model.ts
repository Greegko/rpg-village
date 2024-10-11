export enum EffectType {
  MeleeDmg,
  RangedDmg,
  MagicDmg,

  Armor,

  ManaRegen,
  HpRegen,
}

export type ArmorEffect = { type: EffectType.Armor; value: number };
export type HpEffect = { type: EffectType.HpRegen; value: number };
export type MeleeDmgEffect = { type: EffectType.MeleeDmg; value: number };
export type RangedDmgEffect = { type: EffectType.RangedDmg; value: number };
export type ManaRegenEffect = { type: EffectType.ManaRegen; value: number };
export type MagicDmgEffect = { type: EffectType.MagicDmg; value: number };

export type Effect = ManaRegenEffect | ArmorEffect | MeleeDmgEffect | HpEffect | RangedDmgEffect | MagicDmgEffect;

export interface Item {
  name: string;
  effects: Effect[];
}

export type Attribute = [current: number, max: number];

export type Buff = { effect: Effect; turn: number };

export interface Unit {
  name: string;
  gold: number;
  mana: Attribute;
  health: Attribute;
  stash: Item[];
  equipment: Item[];
  buffs: Buff[];
}
