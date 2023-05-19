import "@core/command";

import { BuyItemCommandArgs, ShopCommand } from "../interfaces";

declare module "@core/command" {
  export interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
