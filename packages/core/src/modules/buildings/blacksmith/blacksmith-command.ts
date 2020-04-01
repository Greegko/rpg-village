import { ItemID, Command } from '../../../models';
import { UnitID } from "../../unit";

export enum BlacksmithCommand {
  UpgradeItem = 'blacksmith/upgrade-item'
};

export interface UpgradeItemCommandArgs { unitId: UnitID, itemId: ItemID };
export interface UpgradeItemCommand extends Command { command: BlacksmithCommand.UpgradeItem, args: UpgradeItemCommandArgs };
