import { ItemID, ItemType } from "@features/item";
import { UnitID } from "@features/unit";

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
  villageId: UnitID;
}
