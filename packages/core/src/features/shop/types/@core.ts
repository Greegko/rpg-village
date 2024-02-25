import { BuyItemCommandArgs, ShopCommand } from "../interfaces";
import { ShopID, ShopState } from "../interfaces";

declare module "@core" {
  interface GameState {
    shops: Record<ShopID, ShopState>;
  }

  interface CommandType {
    [ShopCommand.BuyItem]: BuyItemCommandArgs;
  }
}
