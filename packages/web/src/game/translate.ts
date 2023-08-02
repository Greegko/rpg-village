import { path } from "rambda";

import { AttackEffectType, DefenseEffectType } from "@rpg-village/core";

import { Path, PathValue } from "./dot-notation";

export const translation = {
  core: {
    model: {
      attackEffectType: {
        [AttackEffectType.Dmg]: "damage",
        [AttackEffectType.CriticalChance]: "critical chance",
      },
      defenseEffectType: {
        [DefenseEffectType.Armor]: "armor",
        [DefenseEffectType.Evasion]: "evasion",
      },
    },
  },
} as const;

type Translation = typeof translation;

export function translate<P extends Path<Translation>>(p: P): PathValue<Translation, P> {
  return path(p, translation) as any;
}
