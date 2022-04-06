import { EquipmentSlot, ItemID, ItemType } from "@models/item";
import { UnitID } from "@modules/unit";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
  CreateItem = "blamsmith/create-item",
}

export interface BlacksmithCommandUpgradeItemArgs {
  unitId: UnitID;
  itemId?: ItemID;
  equipmentSlot?: EquipmentSlot;
}

export interface BlacksmithCommanCreateItemArgs {
  itemType: ItemType;
}

declare module "../../../../core/command/command-type" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommanCreateItemArgs;
  }
}
