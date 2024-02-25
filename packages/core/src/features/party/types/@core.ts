import { PartyEvent, PartyEventDisbandArgs } from "../interfaces";
import { Party, PartyID } from "../interfaces";

declare module "@core" {
  interface GameState {
    parties: Record<PartyID, Party>;
  }
  interface EventType {
    [PartyEvent.Disband]: PartyEventDisbandArgs;
  }
}
