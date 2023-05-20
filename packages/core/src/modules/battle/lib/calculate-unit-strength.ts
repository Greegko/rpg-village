import { Unit, calculateUnitStatsWithEffects } from "@modules/unit";

export function calculateUnitStrength(unit: Unit): number {
  const battleStats = calculateUnitStatsWithEffects(unit);

  return (
    (battleStats.dmg + battleStats.evasion + battleStats.armor + battleStats.criticalChance) * (unit.hp / unit.maxhp)
  );
}
