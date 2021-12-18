import { EquipmentSlot, ItemID } from "@models/item";
import { UnitID } from "../interfaces";

export enum UnitCommand {
  EquipItem = "unit/equip-item",
  UnequipItem = "unit/unequip-item",
}

export interface UnitCommandEquipItemArgs {
  unitId: UnitID;
  itemId: ItemID;
  slot: EquipmentSlot;
}

export interface UnitCommandUnequipItemArgs {
  unitId: UnitID;
  slot: EquipmentSlot;
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [UnitCommand.EquipItem]: UnitCommandEquipItemArgs;
    [UnitCommand.UnequipItem]: UnitCommandUnequipItemArgs;
  }
}
