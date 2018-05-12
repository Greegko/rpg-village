import { Event, StashID, ItemID } from '@greegko/rpg-model';

export enum BlacksmithEvents {
  UpgradeItem = 'blacksmith/upgrade-item'
};

export interface UpgradeItemArgs { stashId: StashID, itemId: ItemID };
export interface UpgradeItem extends Event { event: BlacksmithEvents.UpgradeItem, args: UpgradeItemArgs };
