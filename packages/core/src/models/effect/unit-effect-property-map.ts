import { Unit } from "@modules/unit";

import { AttackEffectType, DefenseEffectType, MiscEffectType } from "./battle-effect";
import { EffectBaseType } from "./effect";

export const unitEffectBasePropertiesMap: Record<EffectBaseType, keyof Unit | null> = {
  [AttackEffectType.Dmg]: "dmg",
  [AttackEffectType.CriticalChance]: "criticalChance",
  [DefenseEffectType.Evasion]: "evasion",
  [DefenseEffectType.Armor]: "armor",
  [MiscEffectType.Hp]: null,
};
