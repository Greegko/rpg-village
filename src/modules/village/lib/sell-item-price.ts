import { Resource, Item } from '../../../models';

export function calculateSellItemPrice(item: Item): Resource {
  return {
    gold: 50
  };
}
