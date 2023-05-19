import "@core/command";

import { BuyItemCommandArgs, ShopCommand } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
