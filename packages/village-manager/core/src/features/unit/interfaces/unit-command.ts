import { ItemID } from "@features/item";

import { UnitID } from "./unit-base";

export enum UnitCommand {
  EquipItem = "unit/equip-item",
  UnequipItem = "unit/unequip-item",
}

export interface UnitCommandEquipItemArgs {
  unitId: UnitID;
  itemId: ItemID;
}

export interface UnitCommandUnequipItemArgs {
  unitId: UnitID;
  itemId: ItemID;
}
