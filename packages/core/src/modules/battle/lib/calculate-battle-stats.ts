import { Effect, unitEffectPropertyMap } from "@models/effect";
import { prop, reduce, sortBy } from "ramda";

import { Unit, getUnitEffects } from "@modules/unit";

import { UnitBattleStats } from "../interfaces";

export function calculateUnitBattleStats(unit: Unit): UnitBattleStats {
  const battleStats: UnitBattleStats = {
    dmg: unit.dmg,
    armor: unit.armor,
    evasion: 0,
    criticalChance: 0,
  };

  const effectsToApply = sortBy(prop("isPercentage"), getUnitEffects(unit));

  return reduce(applyEffect, battleStats, effectsToApply);
}

function getEffectProperty(effect: Effect): keyof UnitBattleStats {
  return unitEffectPropertyMap[effect.type] as keyof UnitBattleStats;
}

function applyEffect(battleStat: UnitBattleStats, effect: Effect): UnitBattleStats {
  let prop = getEffectProperty(effect);

  if (!prop) return battleStat;

  if (effect.isPercentage) {
    battleStat[prop] *= effect.value;
  } else {
    battleStat[prop] += effect.value;
  }

  return battleStat;
}
