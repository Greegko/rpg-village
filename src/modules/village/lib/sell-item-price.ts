import { Item } from '@greegko/rpg-model';
import { Resource } from '../../../models';

export function calculateSellItemPrice(item: Item): Resource {
  return {
    gold: 50
  };
}
