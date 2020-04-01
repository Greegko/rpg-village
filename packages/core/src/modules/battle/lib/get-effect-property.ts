import { Effect, unitEffectPropertyMap } from '../../../models';
import { BattleStats } from '../interfaces';

export function getEffectProperty(effect: Effect): keyof BattleStats {
  return unitEffectPropertyMap[effect.type] as any;
}
