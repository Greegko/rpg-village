import { UnitID } from "@features/unit";
import { StashLocation } from "@features/village";
import { ItemID, ItemType } from "@models";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
  CreateItem = "blacksmith/create-item",
}

export type BlacksmithCommandUpgradeItemUnitArgs = {
  itemId: ItemID;
  unitId: UnitID;
  stash?: StashLocation.Unit;
};

export type BlacksmithCommandUpgradeItemVillageStashArgs = {
  itemId: ItemID;
  stash: StashLocation.Village;
};

export type BlacksmithCommandUpgradeItemArgs =
  | BlacksmithCommandUpgradeItemUnitArgs
  | BlacksmithCommandUpgradeItemVillageStashArgs;

export interface BlacksmithCommandCreateItemArgs {
  itemType: ItemType;
}
