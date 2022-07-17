import { EquipmentSlot, ItemID, ItemType } from "@models/item";
import { StashLocation, UnitID } from "@modules/unit";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
  CreateItem = "blacksmith/create-item",
}

export type BlacksmithCommandUpgradeItemArgs =
  | {
      unitId: UnitID;
      equipmentSlot: EquipmentSlot;
    }
  | {
      unitId: UnitID;
      itemId: ItemID;
      stash: StashLocation;
    };

export interface BlacksmithCommandCreateItemArgs {
  itemType: ItemType;
}

declare module "../../../../core/command/command-type" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
