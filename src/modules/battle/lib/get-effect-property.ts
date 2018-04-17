import { Effect, heroEffectPropertyMap } from '@greegko/rpg-model';
import { BattleStats } from '../interfaces';

export function getEffectProperty(effect: Effect): keyof BattleStats {
  return heroEffectPropertyMap[effect.type] as any;
}
