import { Effect } from '../../../models';
import { BattleStats } from '../interfaces';
import { getEffectProperty } from './get-effect-property';

export function applyEffect(acc: BattleStats, effect: Effect): BattleStats {
  let prop = getEffectProperty(effect);

  if(!prop) return acc;

  if(effect.isPercentage){
    acc[prop] *= effect.value;
  } else {
    acc[prop] += effect.value;
  }

  return acc;
}