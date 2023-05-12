import { ItemID } from "@models/item";

import { ShopID } from "./shop-store";

export enum ShopCommand {
  BuyItem = "shop/buy",
}

export interface BuyItemCommandArgs {
  shopItemId: ItemID;
  shopId: ShopID;
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
