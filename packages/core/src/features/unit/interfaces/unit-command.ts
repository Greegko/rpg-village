import { ItemID } from "@models";

import { UnitID } from ".";

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
