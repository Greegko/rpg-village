import { generateId } from "@lib/generate-id";

import { DungeonKey, ItemType } from "@features/item";

export function createDungeonKey(): DungeonKey {
  return {
    id: generateId(),
    name: "Dungeon Key",
    effects: [],
    itemType: ItemType.DungeonKey,
  };
}
