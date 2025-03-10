import { Party, PartyEvent, PartyEventDisbandArgs, PartyID } from "../interfaces";

declare module "@rpg-village/core/extend" {
  interface GameState {
    parties: Record<PartyID, Party>;
  }
  interface EventType {
    [PartyEvent.Disband]: PartyEventDisbandArgs;
  }
}
