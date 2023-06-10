import { Party, PartyID } from "../interfaces";

declare module "@core" {
  export interface GameState {
    parties: Record<PartyID, Party>;
  }
}
