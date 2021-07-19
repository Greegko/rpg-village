import { EffectTarget, Effect } from '@models/effect';

export function isPartyEffect(effect: Effect) {
  return effect.target === EffectTarget.Party;
}
