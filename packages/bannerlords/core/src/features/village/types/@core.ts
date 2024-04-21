import { Village, VillageID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    villages: Record<VillageID, Village>;
  }
}
