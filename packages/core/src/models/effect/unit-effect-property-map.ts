import { AttackEffectType, DefenseEffectType } from "./battle-effect";
import { EffectBaseType } from "./effect";

export const unitEffectBasePropertiesMap: Record<EffectBaseType, string> = {
  [AttackEffectType.Dmg]: "dmg",
  [AttackEffectType.CriticalChance]: "criticalChance",
  [DefenseEffectType.Evasion]: "evasion",
  [DefenseEffectType.Armor]: "armor"
};
