import { UnitID } from "@features/unit";
import { ItemID, ItemType } from "@models";
import { StashLocation } from "@modules/village";

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

declare module "@core" {
  export interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
    [BlacksmithCommand.CreateItem]: BlacksmithCommandCreateItemArgs;
  }
}
