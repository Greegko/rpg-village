import { generate } from "shortid";

import { DungeonKey, ItemType } from "@models/item";

export function createDungeonKey(): DungeonKey {
  return {
    id: generate(),
    name: "Dungeon Key",
    effects: [],
    itemType: ItemType.DungeonKey,
  };
}
