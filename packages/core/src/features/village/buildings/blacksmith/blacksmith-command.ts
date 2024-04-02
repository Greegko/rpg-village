import { UnitID } from "@features/unit";
import { ItemID, ItemType } from "@models";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
  CreateItem = "blacksmith/create-item",
}

export type BlacksmithCommandUpgradeItemArgs = {
  itemId: ItemID;
  unitId: UnitID;
};

export interface BlacksmithCommandCreateItemArgs {
  itemType: ItemType;
  unitId: UnitID;
}
