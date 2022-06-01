import { generate } from "shortid";

import { ItemType, Rune } from "@models/item";

export function createRune(): Rune {
  return {
    id: generate(),
    name: "Rune",
    effects: [],
    itemType: ItemType.Rune,
  };
}
