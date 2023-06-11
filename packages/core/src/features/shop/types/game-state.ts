import { ShopID, ShopState } from "../interfaces";

declare module "@core" {
  export interface GameState {
    shops: Record<ShopID, ShopState>;
  }
}
