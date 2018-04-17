import { Item, Resource } from '@greegko/rpg-model';

export function calculateSellItemPrice(item: Item): Resource {
  return {
    gold: 50
  };
}
