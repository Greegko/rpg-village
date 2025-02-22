import { Clan, ClanID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    clans: Record<ClanID, Clan>;
  }
}
