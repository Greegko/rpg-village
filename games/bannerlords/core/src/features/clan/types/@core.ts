import { Clan, ClanID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    clans: Record<ClanID, Clan>;
  }
}
