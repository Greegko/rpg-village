import { evolve, groupBy, mapValues } from "remeda";

import { Effect, EffectType, StatState, Unit } from "./model";

export function executeEffects(attackerEffects: Record<EffectType, number>, target: Unit): Unit {
  const defenderEffects = effectsStats(target.buffs.map(x => x.effect));

  const dmg =
    Math.max(0, attackerEffects[EffectType.MeleeDmg] - defenderEffects[EffectType.Armor]) +
    Math.max(0, attackerEffects[EffectType.RangedDmg] - defenderEffects[EffectType.Armor]) +
    Math.max(0, attackerEffects[EffectType.MagicDmg] - defenderEffects[EffectType.Armor]);

  return evolve(target, { health: ([current, max]) => [Math.max(0, current - dmg), max] as StatState });
}

export function effectsStats(effects: Effect[]) {
  const baseEffectsValue = [
    { type: EffectType.Armor, value: 0 },
    { type: EffectType.HpRegen, value: 0 },
    { type: EffectType.MeleeDmg, value: 0 },
    { type: EffectType.RangedDmg, value: 0 },
    { type: EffectType.ManaRegen, value: 0 },
    { type: EffectType.MagicDmg, value: 0 },
  ];

  const effectsGroup = groupBy([...baseEffectsValue, ...effects], effect => effect.type);

  return mapValues(effectsGroup, x => x.reduce((acc, val) => acc + val.value, 0)) as Record<EffectType, number>;
}
