import { EffectTarget, Effect } from '../../../models';

export function isPartyEffect(effect: Effect) {
  return effect.target === EffectTarget.Party;
}
