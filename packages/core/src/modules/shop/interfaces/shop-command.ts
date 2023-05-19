import { ItemID } from "@models/item";

import { ShopID } from "./shop-store";

export enum ShopCommand {
  BuyItem = "shop/buy",
}

export interface BuyItemCommandArgs {
  shopItemId: ItemID;
  shopId: ShopID;
}

declare module "@core/command" {
  interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
