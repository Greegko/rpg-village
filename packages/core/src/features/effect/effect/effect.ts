import { AttackEffectType, DefenseEffectType, MiscEffectType, RuneAttackEffectType } from "./battle-effect";

export type EffectBaseType = AttackEffectType | DefenseEffectType | MiscEffectType;

export enum EffectType {
  Static,
  Dynamic,
}

export interface EffectStatic {
  type: EffectType.Static;
  effectType: EffectBaseType;
  value: number;
  isPercentage?: boolean;
}

export type EffectDynamicType = RuneAttackEffectType;

export interface EffectDynamic {
  type: EffectType.Dynamic;
  effectType: EffectDynamicType;
  isPercentage?: boolean;
}

export type Effect = EffectStatic | EffectDynamic;
