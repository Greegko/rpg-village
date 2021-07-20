import { AttackEffectType, DefenseEffectType } from "./battle-effect";

export const unitEffectPropertyMap: { [key: number]: string } = {
  [AttackEffectType.Dmg]: "dmg",
  [AttackEffectType.CriticalChance]: "criticalChance",
  [DefenseEffectType.Evasion]: "evasion",
  [DefenseEffectType.Armor]: "armor",
};
