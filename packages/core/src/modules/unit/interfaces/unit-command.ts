import { Command } from "@core/command";
import { EquipmentSlot, ItemID } from "@models/item";
import { UnitID } from "../interfaces";

export enum UnitCommand {
  EquipItem = "unit/equip-item",
  UnequipItem = "unit/unequip-item",
}

export interface UnitEquipItemCommandArgs {
  unitId: UnitID;
  itemId: ItemID;
  slot: EquipmentSlot;
}

export interface UnitEquipItemCommand extends Command {
  command: UnitCommand.EquipItem;
  args: UnitEquipItemCommandArgs;
}

export interface UnitUnequipItemCommandArgs {
  unitId: UnitID;
  slot: EquipmentSlot;
}

export interface UnitUnequipItemCommand extends Command {
  command: UnitCommand.UnequipItem;
  args: UnitUnequipItemCommandArgs;
}
