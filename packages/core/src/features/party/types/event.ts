import { PartyEvent, PartyEventDisbandArgs } from "../interfaces";

declare module "@core" {
  export interface EventType {
    [PartyEvent.Disband]: PartyEventDisbandArgs;
  }
}
