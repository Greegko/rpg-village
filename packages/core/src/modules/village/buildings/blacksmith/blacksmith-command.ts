import { EquipmentSlot, ItemID, ItemType } from "@models/item";
import { UnitID } from "@modules/unit";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
  CreateItem = "blacksmith/create-item",
}

export interface BlacksmithCommandUpgradeItemArgs {
  unitId: UnitID;
  itemId?: ItemID;
  equipmentSlot?: EquipmentSlot;
}

export interface BlacksmithCommandCreateItemArgs {
  itemType: ItemType;
}

declare module "../../../../core/command/command-type" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
