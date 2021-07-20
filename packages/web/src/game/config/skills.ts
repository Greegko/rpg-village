import { Skill, AttackEffectType, DefenseEffectType, EffectTarget } from "@rpg-village/core";

export const availableSkills: Skill[] = [
  /* Common */
  {
    id: "weapon-mastery",
    effects: [{ target: EffectTarget.Unit, type: AttackEffectType.Dmg, value: 10, isPercentage: true }],
  },
  {
    id: "critical-chance",
    effects: [{ target: EffectTarget.Unit, type: AttackEffectType.CriticalChance, value: 25, isPercentage: false }],
  },
  {
    id: "evasion",
    effects: [{ target: EffectTarget.Unit, type: DefenseEffectType.Evasion, value: 15, isPercentage: false }],
  },
  {
    id: "stone-skin",
    effects: [{ target: EffectTarget.Unit, type: DefenseEffectType.Armor, value: 10, isPercentage: true }],
  },
];
