import { AttackEffectType, DefenseEffectType, MiscEffectType, RuneAttackEffectType } from "./battle-effect";

export type EffectBaseType = AttackEffectType | DefenseEffectType | MiscEffectType;

export interface EffectBase {
  type: EffectBaseType;
  value: number;
  isPercentage?: boolean;
}

export type EffectDynamicType = RuneAttackEffectType;

export interface EffectDynamic {
  type: EffectDynamicType;
  isPercentage?: boolean;
}

export type Effect = EffectBase | EffectDynamic;
