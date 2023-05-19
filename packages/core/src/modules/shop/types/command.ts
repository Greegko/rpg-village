import { BuyItemCommandArgs, ShopCommand } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
