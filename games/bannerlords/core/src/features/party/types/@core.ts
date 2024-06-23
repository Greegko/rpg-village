import { Party, PartyID } from "../interface";

declare module "@rpg-village/core" {
  interface GameState {
    parties: Record<PartyID, Party>;
  }
}
