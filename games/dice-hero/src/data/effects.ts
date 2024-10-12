import { evolve, groupBy, mapValues } from "remeda";

import { Attribute, Effect, EffectType, Unit } from "./model";

export function executeSelfEffects(attackerEffects: Record<EffectType, number>, attacker: Unit): Unit {
  const hpRegen = attackerEffects[EffectType.HpRegen];

  return evolve(attacker, { health: ([current, max]) => [Math.min(max, current + hpRegen), max] as Attribute });
}

export function executeAttackEffects(
  attackerEffects: Record<EffectType, number>,
  defender: Unit,
  defenderEffects: Record<EffectType, number>,
): Unit {
  const dmg =
    Math.max(0, attackerEffects[EffectType.PhysicalDmg] - defenderEffects[EffectType.Armor]) +
    Math.max(0, attackerEffects[EffectType.MagicDmg] - defenderEffects[EffectType.Armor]);

  return evolve(defender, { health: ([current, max]) => [Math.max(0, current - dmg), max] as Attribute });
}

export function effectsStats(effects: Effect[]) {
  const baseEffectsValue = [
    { type: EffectType.Armor, value: 0 },
    { type: EffectType.HpRegen, value: 0 },
    { type: EffectType.PhysicalDmg, value: 0 },
    { type: EffectType.ManaRegen, value: 0 },
    { type: EffectType.MagicDmg, value: 0 },
  ];

  const effectsGroup = groupBy([...baseEffectsValue, ...effects], effect => effect.type);

  return mapValues(effectsGroup, x => x.reduce((acc, val) => acc + val.value, 0)) as Record<EffectType, number>;
}
