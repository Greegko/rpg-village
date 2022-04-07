import { DungeonKey, ItemType } from "@models/item";
import { generate } from "shortid";

export function createDungeonKey(): DungeonKey {
  return {
    id: generate(),
    name: "Dungeon Key",
    effects: [],
    itemType: ItemType.DungeonKey,
  };
}
