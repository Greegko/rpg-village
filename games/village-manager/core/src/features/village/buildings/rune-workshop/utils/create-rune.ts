import { generateId } from "@rpg-village/core";

import { EffectType, RuneAttackEffectType } from "@features/effect";
import { ItemType, Rune } from "@features/item";

export function createRune(): Rune {
  return {
    id: generateId(),
    name: "Rune",
    effects: [{ type: EffectType.Dynamic, effectType: RuneAttackEffectType.Dmg }],
    power: 100,
    soul: 0,
    itemType: ItemType.Rune,
  };
}
