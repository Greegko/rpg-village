import { PartyEvent, PartyEventArrivedToLocationArgs } from "../interfaces";

declare module "@core" {
  export interface EventType {
    [PartyEvent.ArrivedToLocation]: PartyEventArrivedToLocationArgs;
  }
}
