import { propOr, reduce, sortBy } from "ramda";

import { EffectBase, unitEffectBasePropertiesMap } from "@models/effect";
import { Unit, getUnitEffects } from "@modules/unit";

import { UnitBattleStats } from "../interfaces";

export function calculateUnitBattleStats(unit: Unit): UnitBattleStats {
  const battleStats: UnitBattleStats = {
    dmg: unit.dmg,
    armor: unit.armor,
    evasion: 0,
    criticalChance: 0,
  };

  const effectsToApply = sortBy(propOr(false, "isPercentage"), getUnitEffects(unit));

  return reduce(applyEffect, battleStats, effectsToApply);
}

function getEffectBaseProperty(effect: EffectBase): keyof UnitBattleStats {
  return unitEffectBasePropertiesMap[effect.type] as keyof UnitBattleStats;
}

function applyEffect(battleStat: UnitBattleStats, effect: EffectBase): UnitBattleStats {
  let prop = getEffectBaseProperty(effect);

  if (!prop) return battleStat;

  if (effect.isPercentage) {
    battleStat[prop] *= effect.value;
  } else {
    battleStat[prop] += effect.value;
  }

  return battleStat;
}
