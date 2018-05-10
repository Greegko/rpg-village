import { BaseItem as ModuleBaseItem } from '@greegko/rpg-model';
import { Effect } from '../effect';
import { ItemType } from './item-types';

export type BaseItem = ModuleBaseItem & {
  itemType: ItemType;
  effects: Effect[];
}
