import { Party, PartyID } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    parties: Record<PartyID, Party>;
  }
}
