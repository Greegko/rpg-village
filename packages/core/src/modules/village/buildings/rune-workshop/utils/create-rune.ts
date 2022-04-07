import { ItemType, Rune } from "@models/item";
import { generate } from "shortid";

export function createRune(): Rune {
  return {
    id: generate(),
    name: "Rune",
    effects: [],
    itemType: ItemType.Rune,
  };
}
