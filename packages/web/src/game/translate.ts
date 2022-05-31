import { path, split, useWith } from "ramda";

import { AttackEffectType, DefenseEffectType } from "@rpg-village/core";

import { Path, PathValue } from "./dot-notation";

const dotPath = useWith(path, [split(".")]);

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

export function translate<P extends Path<Translation>>(path: P): PathValue<Translation, P> {
  return dotPath(path, translation);
}
