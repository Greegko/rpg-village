import { UnitID } from "..";
import { EquipmentPlace, ItemID, Command } from '../../../models';

export enum UnitCommand {
  EquipItem = 'unit/equip-item',
  UnequipItem = 'unit/unequip-item'
};

export interface UnitEquipItemCommandArgs {
  unitId: UnitID;
  itemId: ItemID;
  place: EquipmentPlace;
}

export interface UnitEquipItemCommand extends Command {
  command: UnitCommand.EquipItem;
  args: UnitEquipItemCommandArgs;
};

export interface UnitUnequipItemCommandArgs {
  unitId: UnitID;
  place: EquipmentPlace;
}

export interface UnitUnequipItemCommand extends Command {
  command: UnitCommand.UnequipItem;
  args: UnitUnequipItemCommandArgs;
};