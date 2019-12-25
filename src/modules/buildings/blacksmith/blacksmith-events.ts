import { ItemID, Event } from '../../../models';
import { UnitID } from "../../unit";

export enum BlacksmithEvents {
  UpgradeItem = 'blacksmith/upgrade-item'
};

export interface UpgradeItemEventArgs { unitId: UnitID, itemId: ItemID };
export interface UpgradeItemEvent extends Event { event: BlacksmithEvents.UpgradeItem, args: UpgradeItemEventArgs };
