import { generate } from "shortid";

import { EffectType, RuneAttackEffectType } from "@models";
import { ItemType, Rune } from "@models";

export function createRune(): Rune {
  return {
    id: generate(),
    name: "Rune",
    effects: [{ type: EffectType.Dynamic, effectType: RuneAttackEffectType.Dmg }],
    power: 100,
    soul: 0,
    itemType: ItemType.Rune,
  };
}
