import { Command } from '@core/command';
import { ItemID } from '@models/item';
import { UnitID } from "@modules/unit";

export enum BlacksmithCommand {
  UpgradeItem = 'blacksmith/upgrade-item'
};

export interface UpgradeItemCommandArgs { unitId: UnitID, itemId: ItemID };
export interface UpgradeItemCommand extends Command { command: BlacksmithCommand.UpgradeItem, args: UpgradeItemCommandArgs };
