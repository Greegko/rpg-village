import { EffectTarget } from './effect-target';
import { AttackEffectType, DefenseEffectType } from './battle-effect';

export interface Effect {
  type: AttackEffectType | DefenseEffectType;
  target: EffectTarget;
  value: number;
  isPercentage: boolean;
};
