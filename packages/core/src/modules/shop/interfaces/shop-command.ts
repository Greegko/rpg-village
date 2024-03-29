import { ItemID } from "@models";

import { ShopID } from "./shop-store";

export enum ShopCommand {
  BuyItem = "shop/buy",
}

export interface BuyItemCommandArgs {
  shopItemId: ItemID;
  shopId: ShopID;
}
