import { Event, StashID } from '@greegko/rpg-model';
import { ItemID } from '../../../models';

export enum BlacksmithEvents {
  UpgradeItem = 'blacksmith/upgrade-item'
};

export interface UpgradeItemEventArgs { stashId: StashID, itemId: ItemID };
export interface UpgradeItemEvent extends Event { event: BlacksmithEvents.UpgradeItem, args: UpgradeItemEventArgs };
