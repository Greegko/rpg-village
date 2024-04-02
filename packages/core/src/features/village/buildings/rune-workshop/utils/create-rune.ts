import { generateId } from "@lib/generate-id";

import { EffectType, ItemType, Rune, RuneAttackEffectType } from "@models";

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
