import { AttackEffectType, DefenseEffectType } from "./battle-effect";

export interface Effect {
  type: AttackEffectType | DefenseEffectType;
  value: number;
  isPercentage?: boolean;
}
