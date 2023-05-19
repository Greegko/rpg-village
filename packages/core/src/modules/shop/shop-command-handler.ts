import { injectable } from "inversify";
import { dec, evolve } from "rambda";

import { commandHandler } from "@core";
import { updateValueInList } from "@lib/update-value-in-list";

import { VillageStashService } from "@modules/village";

import { BuyItemCommandArgs, ShopCommand, ShopItem } from "./interfaces";
import { ShopStore } from "./shop-store";

@injectable()
export class ShopCommandHandler {
  constructor(private villageStashService: VillageStashService, private shopStore: ShopStore) {}

  @commandHandler(ShopCommand.BuyItem)
  shopItem(args: BuyItemCommandArgs) {
    const item = this.shopStore.get(args.shopId).items.find(x => x.id === args.shopItemId);

    if (!item) return;

    if (this.villageStashService.hasEnoughResource(item.price)) {
      this.villageStashService.removeResource(item.price);

      const updateItem = (items: ShopItem[]) =>
        updateValueInList(items, item, x => (x.quantity > 1 ? evolve({ quantity: dec }, x) : null));

      this.shopStore.update(args.shopId, evolve({ items: updateItem }));

      this.villageStashService.addItems([item.item]);
    }
  }
}
