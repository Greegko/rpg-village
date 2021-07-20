import { sortBy, prop, reduce } from "ramda";
import { Effect } from "@models/effect";
import { BattleStats } from "../interfaces";
import { applyEffect } from "./apply-effect";

export function calculateBattleStats(baseDmg: number, baseArmor: number, effects: Effect[]): BattleStats {
  const battleStats: BattleStats = {
    dmg: baseDmg,
    armor: baseArmor,
    evasion: 0,
    criticalChance: 0,
  };
  const effectsToApply = sortBy(prop("isPercentage"), effects);

  return reduce(applyEffect, battleStats, effectsToApply);
}
