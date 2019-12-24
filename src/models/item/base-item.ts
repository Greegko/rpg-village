import { Effect } from '../effect';
import { ItemType } from './item-types';

export type ItemID = string;

export type BaseItem = {
  id: ItemID;
  name: string;
  itemType: ItemType;
  effects: Effect[];
}
