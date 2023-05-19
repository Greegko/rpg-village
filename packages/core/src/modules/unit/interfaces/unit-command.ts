import { ItemID } from "@models";

import { UnitID } from "../interfaces";

export enum UnitCommand {
  EquipItem = "unit/equip-item",
  UnequipItem = "unit/unequip-item",
}

export enum StashLocation {
  Unit,
  Village,
}

export interface UnitCommandEquipItemArgs {
  unitId: UnitID;
  itemId: ItemID;
  stash: StashLocation;
}

export interface UnitCommandUnequipItemArgs {
  unitId: UnitID;
  itemId: ItemID;
  stash: StashLocation;
}
