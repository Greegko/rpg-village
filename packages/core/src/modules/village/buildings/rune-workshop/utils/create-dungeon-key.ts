import { generate } from "shortid";

import { DungeonKey, ItemType } from "@models";

export function createDungeonKey(): DungeonKey {
  return {
    id: generate(),
    name: "Dungeon Key",
    effects: [],
    itemType: ItemType.DungeonKey,
  };
}
