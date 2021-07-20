import { EffectTarget } from "./effect-target";
import { AttackEffectType, DefenseEffectType } from "./battle-effect";

export interface Effect {
  type: AttackEffectType | DefenseEffectType;
  value: number;
  target?: EffectTarget;
  isPercentage?: boolean;
}
