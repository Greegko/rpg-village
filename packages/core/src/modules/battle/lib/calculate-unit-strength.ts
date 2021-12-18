import { Unit } from "@modules/unit";

import { calculateUnitBattleStats } from "./calculate-battle-stats";

export function calculateUnitStrength(unit: Unit): number {
  const battleStats = calculateUnitBattleStats(unit);

  return (
    (battleStats.dmg + battleStats.evasion + battleStats.armor + battleStats.criticalChance) * (unit.hp / unit.maxhp)
  );
}
