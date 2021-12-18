import { EquipmentSlot, ItemID } from "@models/item";
import { UnitID } from "@modules/unit";

export enum BlacksmithCommand {
  UpgradeItem = "blacksmith/upgrade-item",
}

export interface BlacksmithCommandUpgradeItemArgs {
  unitId: UnitID;
  itemId?: ItemID;
  equipmentSlot?: EquipmentSlot;
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [BlacksmithCommand.UpgradeItem]: BlacksmithCommandUpgradeItemArgs;
  }
}
