import { generate } from "shortid";

import { ItemType, Rune } from "@models/item";
import { RuneAttackEffectType } from "@models/effect";

export function createRune(): Rune {
  return {
    id: generate(),
    name: "Rune",
    effects: [{ type: RuneAttackEffectType.Dmg }],
    power: 100,
    soul: 0,
    itemType: ItemType.Rune,
  };
}
